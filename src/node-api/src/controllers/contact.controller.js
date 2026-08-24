import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

import Municipality from "../models/municipality.model.js";
import User from "../models/user.model.js";
import { error_codes } from "../utils/error_codes.js";
import Contact from "../models/contact.model.js";
import {
  CSV_COLUMNS,
  ROLES,
  TOWN_COLUMN,
  MUNICIPALITY_ID_COLUMN,
  CLERK_OFFICE_PROVIDED_INFO_COLUMN,
  CONTACT_FORM,
  TOWN_CLERK_TITLE,
  parseBoolean,
  buildExportRow,
} from "../utils/contacts-csv.js";

let contactController = {
  // Route for the import from JSON. Probably should remove at some point
  // create: async (req, res, next) => {
  //   let data = req.body;

  //   let municipality = await Municipality.findOne({
  //     where: {
  //       name: data.town,
  //     },
  //   });

  //   if (!municipality) {
  //     console.log("Couldn't find:", data.town, data);
  //     throw "Municipality Not Found";
  //   }

  //   await Promise.all(
  //     data.contacts.map((contact) => {
  //       return municipality.createContact(contact);
  //     }),
  //   );

  //   return res.status(200).json({ status: "Success" });
  // },
  upload: async (req, res, next) => {
    // Only allow superusers to upload the CSV
    const userRecord = await User.findByPk(req.jwt.user.id);
    if (!userRecord) {
      return res.status(401).json({ success: false, error_msg: error_codes["USER_DOES_NOT_EXIST"] });
    }
    if (!userRecord.superuser) {
      return res.status(401).json({ success: false, error_msg: error_codes["UNAUTHORIZED"] });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No CSV file uploaded" });
    }

    let records;
    try {
      records = parse(req.file.buffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    } catch (error) {
      return res.status(400).json({
        error: "Could not parse CSV file",
        detail: error.message,
      });
    }

    const results = {
      total: records.length,
      updated: 0,
      unchanged: 0,
      failed: 0,
      warnings: [],
      errors: [],
    };

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rowNumber = i + 2; // +1 for header row, +1 for 1-indexing

      try {
        const municipalityId = parseInt(row[MUNICIPALITY_ID_COLUMN], 10);

        if (!municipalityId || Number.isNaN(municipalityId)) {
          throw new Error(
            `Missing or invalid ${MUNICIPALITY_ID_COLUMN}: "${row[MUNICIPALITY_ID_COLUMN]}"`,
          );
        }

        const municipality = await Municipality.findByPk(municipalityId, {
          include: [{ model: Contact, as: "contacts" }],
        });

        if (!municipality) {
          throw new Error(
            `No municipality found for ${MUNICIPALITY_ID_COLUMN} ${municipalityId}`,
          );
        }

        const townName = (row[TOWN_COLUMN] || "").trim().toLowerCase();
        if (townName && townName !== municipality.name.toLowerCase()) {
          results.warnings.push({
            row: rowNumber,
            message: `Town "${townName}" does not match municipality ${municipalityId} ("${municipality.name}") - row was still applied by Municipality ID`,
          });
        }

        const providedInfo = parseBoolean(
          row[CLERK_OFFICE_PROVIDED_INFO_COLUMN],
        );

        let changed = false;

        await Municipality.sequelize.transaction(async (transaction) => {
          for (const role of ROLES) {
            const name = (row[role.nameCol] || "").trim() || null;
            const email = (row[role.emailCol] || "").trim() || null;
            const officeEmail = (row[role.officeEmailCol] || "").trim() || null;

            const existing = municipality.contacts.find(
              (c) => c.title === role.title,
            );

            if (!existing) {
              if (!name && !email && !officeEmail) {
                continue;
              }

              await Contact.create(
                {
                  municipality_id: municipality.id,
                  title: role.title,
                  name,
                  email,
                  office_email: officeEmail,
                },
                { transaction },
              );
              changed = true;
              continue;
            }

            if (
              existing.name !== name ||
              existing.email !== email ||
              existing.office_email !== officeEmail
            ) {
              await existing.update(
                { name, email, office_email: officeEmail },
                { transaction },
              );
              changed = true;
            }
          }

          if (municipality.clerk_office_provided_info !== providedInfo) {
            municipality.clerk_office_provided_info = providedInfo;
            changed = true;
          }

          if (changed) {
            municipality.contact_info_last_updated = new Date();
            await municipality.save({ transaction });
          }
        });

        if (changed) {
          results.updated++;
        } else {
          results.unchanged++;
        }
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: rowNumber,
          town: row[TOWN_COLUMN] || null,
          municipalityId: row[MUNICIPALITY_ID_COLUMN] || null,
          message: error.message,
        });
      }
    }

    return res.status(200).json(results);
  },
  download: async (req, res, next) => {
    // Only allow superusers to download the CSV
    const userRecord = await User.findByPk(req.jwt.user.id);
    if (!userRecord) {
      return res.status(401).json({ success: false, error_msg: error_codes["USER_DOES_NOT_EXIST"] });
    }
    if (!userRecord.superuser) {
      return res.status(401).json({ success: false, error_msg: error_codes["UNAUTHORIZED"] });
    }

    const municipalities = await Municipality.findAll({
      where: { type: "TOWN" },
      include: [{ model: Contact, as: "contacts" }],
      order: [["name", "ASC"]],
    });

    const rows = municipalities.map(buildExportRow);
    const csv = stringify(rows, { header: true, columns: CSV_COLUMNS });

    res.status(200);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="contacts.csv"',
    );
    return res.send(csv);
  },
};

export default contactController;
