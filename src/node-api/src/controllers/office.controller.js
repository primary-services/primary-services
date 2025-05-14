import Office from "../models/office.model.js";
import Seat from "../models/seat.model.js";

import {
  BadRequestError,
  UnauthorizedError,
  ValidationError,
} from "../utils/ApiError";

let officeController = {
  save: async (req, res, next) => {
    try {
      let data = req.body;

      let office = await Office.findOne({ where: { id: 394 } });
      let seat = await Seat.findOne({ where: { id: 23 } });

      office.removeSeat(seat);

      // for (let x in Office.associations) {
      //   console.log(Office.associations[x].accessors);
      // }

      // let office = Office.prototype.upsertAll(data);

      return res.status(200).json(office);
    } catch (error) {
      next(error);
    }
  },
};

export default officeController;
