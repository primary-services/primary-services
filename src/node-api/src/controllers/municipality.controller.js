import Municipality from "../models/municipality.model.js";
import Election from "../models/election.model.js";
import Official from "../models/official.model.js";
import Office from "../models/office.model.js";
import Seat from "../models/seat.model.js";
import Term from "../models/term.model.js";

import Requirement from "../models/requirement.model.js";
import Deadline from "../models/deadline.model.js";
import Form from "../models/form.model.js";

import {
  BadRequestError,
  UnauthorizedError,
  ValidationError,
} from "../utils/ApiError";

let municipalityController = {
  list: async (req, res, next) => {
    try {
      // TODO: leaving for my own reference for now
      // const munipalities = await Municipality.findAll({
      //   include: [{ model: Office, include: Official }],
      // });

      const municipalities = await Municipality.findAll();

      return res.status(200).json(municipalities);
    } catch (error) {
      next(error);
    }
  },

  offices: async (req, res, next) => {
    const { municipality_id } = req.params;

    try {
      const offices = await Office.findAll({
        where: {
          municipality_id: municipality_id,
        },
        include: [
          { model: Official, as: "officials" },
          {
            model: Seat,
            as: "seats",
            include: [
              {
                model: Term,
                as: "terms",
                include: [
                  {
                    model: Election,
                    as: "elections",
                    through: {
                      attributes: [],
                    },
                  },
                ],
              },
            ],
          },
        ],
      });

      return res.status(200).json(offices);
    } catch (error) {
      next(error);
    }
  },

  elections: async (req, res, next) => {
    const { municipality_id } = req.params;

    try {
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
    } catch (error) {
      next(error);
    }
  },

  collections: async (req, res, next) => {
    const { municipality_id } = req.params;

    try {
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
        ],
      });

      return res.status(200).json(municipality);
    } catch (error) {
      next(error);
    }
  },
};

export default municipalityController;
