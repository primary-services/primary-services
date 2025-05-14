import Municipality from "../models/municipality.model.js";
import Election from "../models/election.model.js";
import Official from "../models/official.model.js";
import Office from "../models/office.model.js";
import Seat from "../models/seat.model.js";
import Term from "../models/term.model.js";

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
          { model: Seat, as: "seats", include: [{ model: Term, as: "terms" }] },
        ],
      });

      return res.status(200).json(offices);
    } catch (error) {
      next(error);
    }
  },

  elections: async (req, res, next) => {
    try {
      const elections = await Election.findAll({
        include: { model: Term },
      });

      return res.status(200).json(elections);
    } catch (error) {
      next(error);
    }
  },
};

export default municipalityController;
