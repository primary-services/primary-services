import { Op } from "sequelize";
import Municipality from "../models/municipality.model.js";
import Election from "../models/election.model.js";
import Official from "../models/official.model.js";
import Contact from "../models/contact.model.js";
import Office from "../models/office.model.js";
import Seat from "../models/seat.model.js";
import Term from "../models/term.model.js";
import Version, { createNewVersion } from "../models/version.model.js";
import User from "../models/user.model.js";

import Requirement from "../models/requirement.model.js";
import Deadline from "../models/deadline.model.js";
import Form from "../models/form.model.js";

import Source from "../models/source.model.js";
import Note from "../models/note.model.js";

let municipalityController = {
  list: async (req, res, next) => {
    const municipalities = await Municipality.findAll({
      include: [{ model: Contact, as: "contacts" }],
      order: [["id", "ASC"]],
    });

    return res.status(200).json(municipalities);
  },

  offices: async (req, res, next) => {
    const { municipality_id } = req.params;

    // try {
    const offices = await Office.findAll({
      where: {
        municipality_id: municipality_id,
        deleted: false,
      },
      include: [
        {
          model: Seat,
          as: "seats",
          include: [
            {
              model: Term,
              as: "terms",
              include: [
                {
                  model: Official,
                  as: "official",
                },
              ],
            },
          ],
        },
      ],
    });

    return res.status(200).json(offices);
  },

  elections: async (req, res, next) => {
    const { municipality_id } = req.params;

    const elections = await Election.findAll({
      where: {
        municipality_id: municipality_id,
      },
      include: [
        {
          model: Term,
          as: "terms",
          include: [{ model: Seat, as: "seat" }],
          through: {
            attributes: [],
          },
        },
        {
          model: Requirement,
          as: "requirements",
          include: [
            { model: Deadline, as: "deadline" },
            { model: Form, as: "form" },
          ],
        },
        { model: Deadline, as: "deadlines" },
        { model: Form, as: "forms" },
      ],
    });

    return res.status(200).json(elections);
  },

  collections: async (req, res, next) => {
    const { municipality_id } = req.params;

    const municipality = await Municipality.findByPk(municipality_id, {
      include: [
        {
          model: Requirement,
          as: "requirements",
          include: [
            { model: Deadline, as: "deadline" },
            { model: Form, as: "form" },
          ],
        },
        { model: Deadline, as: "deadlines" },
        { model: Form, as: "forms" },
        { model: Source, as: "sources", where: { deleted: false } },
        { model: Note, as: "notes", where: { deleted: false } },
      ],
    });

    return res.status(200).json(municipality);
  },

  history: async (req, res, next) => {
    const { municipality_id } = req.params;

    const municipality = await Municipality.findByPk(municipality_id, {
      include: [
        // When we want more item types included in the history response, add it here
        { model: Source, as: "sources" },
        { model: Note, as: "notes" },
        { model: Office, as: "offices" },
      ],
    });
    const sourceIds = municipality.sources.map((s) => s.id);
    const noteIds = municipality.notes.map((n) => n.id);
    const officeIds = municipality.offices.map((o) => o.id);

    const versions = await Version.findAll({
      where: {
        [Op.or]: [
          {
            item_type: "Municipality",
            item_id: municipality.id,
          },
          {
            item_type: "Source",
            item_id: {
              [Op.in]: sourceIds,
            },
          },
          {
            item_type: "Note",
            item_id: {
              [Op.in]: noteIds,
            },
          },
          {
            item_type: "Office",
            item_id: {
              [Op.in]: officeIds,
            },
          },
        ],
      },
      include: [
        { model: User, as: "user" },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json(versions);
  },

  save: async (req, res, next) => {
    let data = req.body;
    let user = req.jwt?.user || null;

    if (!user) {
      return res.status(401).json({
        error_code: "UNAUTHORIZED",
        error_msg: error_codes["UNAUTHORIZED"],
      });
    }
    let municipality = await Municipality.findByPk(data.id);
    if (!municipality) {
      return res.status(404).json({ error: "Municipality not found" });
    }
    municipality = await createNewVersion(Municipality, user, data);
    return res.status(200).json(municipality);
  },

  createSource: async (req, res, next) => {
    let data = req.body;
    let user = req.jwt?.user || null;

    if (!user) {
      return res.status(401).json({
        error_code: "UNAUTHORIZED",
        error_msg: error_codes["UNAUTHORIZED"],
      });
    }

    const source = await createNewVersion(Source, user, data)
    return res.status(200).json(source);
  },

  deleteSource: async (req, res, next) => {
    let { source_id } = req.params;
    let user = req.jwt?.user || null;

    if (!user) {
      return res.status(401).json({
        error_code: "UNAUTHORIZED",
        error_msg: error_codes["UNAUTHORIZED"],
      });
    }

    if (!!source_id) {
      const original = await Source.findByPk(source_id);
      original.deleted = true;
      await createNewVersion(Source, user, original.dataValues);
    }

    return res.status(200).json({ success: true });
  },

  createNote: async (req, res, next) => {
    let data = req.body;
    let user = req.jwt?.user || null;

    if (!user) {
      return res.status(401).json({
        error_code: "UNAUTHORIZED",
        error_msg: error_codes["UNAUTHORIZED"],
      });
    }
    
    const note = await createNewVersion(Note, user, data);
    return res.status(200).json(note);
  },

  deleteNote: async (req, res, next) => {
    let { note_id } = req.params;
    let user = req.jwt?.user || null;

    if (!user) {
      return res.status(401).json({
        error_code: "UNAUTHORIZED",
        error_msg: error_codes["UNAUTHORIZED"],
      });
    }

    if (!!note_id) {
       const original = await Note.findByPk(note_id);
       original.deleted = true;
       await createNewVersion(Note, user, original.dataValues);
    }
    return res.status(200).json({ success: true });
  },
};

export default municipalityController;
