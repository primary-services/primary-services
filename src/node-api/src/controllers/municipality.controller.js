import Municipality from "../models/municipality.model.js";
import Election from "../models/election.model.js";
import Official from "../models/official.model.js";
import Contact from "../models/contact.model.js";
import Office from "../models/office.model.js";
import Seat from "../models/seat.model.js";
import Term from "../models/term.model.js";
import Version from "../models/version.model.js";

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
        { model: Source, as: "sources" },
        { model: Note, as: "notes" },
      ],
    });

    return res.status(200).json(municipality);
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
    municipality = await municipality.update(data);
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

    let source = await Source.prototype.upsertAll(data);
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
      await Source.destroy({
        where: {
          id: source_id,
        },
      });
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

    let note = await Note.prototype.upsertAll(data);
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
      await Note.destroy({
        where: {
          id: note_id,
        },
      });
    }

    return res.status(200).json({ success: true });
  },
};

export default municipalityController;
