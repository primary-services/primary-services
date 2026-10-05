import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

import Municipality from "../models/municipality.model.js";
import User from "../models/user.model.js";
import Contact from "../models/contact.model.js";
import Office from "../models/office.model.js";
import Seat from "../models/seat.model.js";
import Term from "../models/term.model.js";
import Official from "../models/official.model.js";

import {
  ROLES,
  TOWN_COLUMN,
  MUNICIPALITY_ID_COLUMN,
  COMPLETION_STATUS_COLUMN,
  CLERK_OFFICE_PROVIDED_INFO_COLUMN,
  CONTACT_NAME_COLUMN,
  CONTACT_EMAIL_COLUMN,
  CONTACT_CC_EMAILS_COLUMN,
  CONTACT_INFO_BLURB_COLUMN,
  OFFICE_INFO_BLURB_COLUMN,
  TOWN_CLERK_TITLE,
  ASSISTANT_TOWN_CLERK_TITLE,
  ADMIN_ASSISTANT_TITLE,
  parseBoolean,
  parseCompletionStatus,
} from "../utils/csv.js";
import { error_codes } from "../utils/error_codes.js";

const CSV_COLUMNS = [
  MUNICIPALITY_ID_COLUMN,
  TOWN_COLUMN,
  COMPLETION_STATUS_COLUMN,
  CLERK_OFFICE_PROVIDED_INFO_COLUMN,
  CONTACT_NAME_COLUMN,
  CONTACT_EMAIL_COLUMN,
  CONTACT_CC_EMAILS_COLUMN,
  CONTACT_INFO_BLURB_COLUMN,
  OFFICE_INFO_BLURB_COLUMN,
];

const CONTACTS_PRIORITY_ORDER = [
  TOWN_CLERK_TITLE,
  ASSISTANT_TOWN_CLERK_TITLE,
  ADMIN_ASSISTANT_TITLE,
];

const buildExportRow = async (town) => {
  if (!town) {
    return undefined; // Skip towns without a municipality
  }

  // Construct the contacts blurb
  const contactsBlurb = town.contacts.reduce((acc, contact) => {
    if (acc) {
      const info = [contact.name, contact.office_email, contact.email, contact.phone_number].filter(Boolean).join(", ");
      return acc + `${contact.title}: ${info}`;
    }
    return acc;
  }, "").trim();
  const contactForms = town.contacts.map(contact => contact.contactForm).filter(Boolean);
  const contactFormsBlurb = (() => {
    switch (contactForms.length) {
      case 0:
        return "";
      case 1:
        return "\nContact Form: " + contactForms[0];
      default:
        return "\nContact Forms: " + contactForms.join(", ");
    }
  })();

  // Find & construct the person to email, their email, 
  const contactsPriorityOrder = town.contacts.sort((a,b) => {
    return CONTACTS_PRIORITY_ORDER.indexOf(a.title) - CONTACTS_PRIORITY_ORDER.indexOf(b.title);
  }).filter(contact => contact.email || contact.office_email);
  const firstContact = contactsPriorityOrder[0];
  const firstEmail = firstContact?.email || firstContact?.office_email || "";
  if (!firstEmail) {
    return undefined; // Skip contacts without an email
  }
  const ccEmails = contactsPriorityOrder.flatMap(contact => contact.email || contact.office_email).filter(email => email).join(", ");

  // Construct the office info blurb (office title - seat name - term date range)
  const officeInfoBlurb = town.offices.map(office => {
    const seats = office.seats || [];
    return seats.map(seat => {
      const term = seat.terms?.[0];
      const official = term?.official;
      // Construct the date range for the term in the form "start_year - end_year"
      const dateRange = [term?.start_year, term?.end_year].filter(Boolean).join("-");
      return [office.title, term?.official?.name || "Vacant", dateRange].filter(Boolean).join(" - ");
    }).filter(Boolean).join("\n");
  }).filter(Boolean).join("\n");

  const row = {
    [MUNICIPALITY_ID_COLUMN]: firstContact.municipality?.id || "",
    [TOWN_COLUMN]: firstContact.municipality?.name || "",
    [COMPLETION_STATUS_COLUMN]: firstContact.municipality?.completionStatus || "",
    [CLERK_OFFICE_PROVIDED_INFO_COLUMN]: firstContact.municipality?.clerk_office_provided_info || "",
    [CONTACT_NAME_COLUMN]: firstContact.name || "",
    [CONTACT_EMAIL_COLUMN]: firstEmail,
    [CONTACT_CC_EMAILS_COLUMN]: ccEmails || "",
    [CONTACT_INFO_BLURB_COLUMN]: contactsBlurb + contactFormsBlurb,
    [OFFICE_INFO_BLURB_COLUMN]: officeInfoBlurb || "",
  };

  return row;
};

let bulkActionsController = {
  // Download CSV with municipality ID, town name, town status, clerk office has provided info, contact name, contact email, cc’s emails, contact info blurb, office info blurb
  // For mail merge to send out to municipalities
  downloadMailMerge: async (req, res, next) => {
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
      include: [{ 
        model: Contact, 
        as: "contacts" 
      }, { 
        model: Office, 
        as: "offices",
        include: [{
          model: Seat,
          as: "seats",
          include: [
            {
              model: Term,
              as: "terms",
              order: [["end_year", "DESC"]],
              separate: true,
              include: [
                {
                  model: Official,
                  as: "official",
                },
              ],
            },
          ],
        },]
      }],
      order: [["id", "ASC"]],
    });

    const rows = (await Promise.all(municipalities.map(buildExportRow))).filter(row => row !== undefined);
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

export default bulkActionsController;
