import Election from "../models/election.model.js";

import {
  BadRequestError,
  UnauthorizedError,
  ValidationError,
} from "../utils/ApiError";

let officeController = {
  save: async (req, res, next) => {
    try {
      let data = req.body;

      let election = Election.prototype.upsertAll(data);

      return res.status(200).json(election);
    } catch (error) {
      next(error);
    }
  },
};

export default officeController;
