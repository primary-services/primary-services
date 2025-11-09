import Municipality from "../models/municipality.model.js";
import Election from "../models/election.model.js";
import Official from "../models/official.model.js";
import Office from "../models/office.model.js";
import Seat from "../models/seat.model.js";
import Term from "../models/term.model.js";
import Version from "../models/version.model.js";

import Requirement from "../models/requirement.model.js";
import Deadline from "../models/deadline.model.js";
import Form from "../models/form.model.js";

import { error_codes } from "../utils/error_codes.js";

let officeController = {
  list: async (req, res, next) => {
    let { municipality_name } = req.params;
    let sequelize = Municipality.sequelize;

    let municipality = await Municipality.findOne({
      where: sequelize.where(
        sequelize.fn("lower", sequelize.col("name")),
        sequelize.fn("lower", municipality_name),
      ),
    });

    // Might want a view here
    let offices = await Office.findAll({
      where: { municipality_id: municipality.id, elected: true },
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
                  model: Election,
                  as: "elections",

                  include: {
                    model: Requirement,
                    as: "requirements",
                    include: [
                      { model: Deadline, as: "deadline" },
                      { model: Form, as: "form" },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    });

    return res.status(200).json(offices);
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

    try {
      let [office, diff] = await Office.prototype.upsertAllAndDiff(data);

      if (diff !== null) {
        let version = Version.build({
          user_id: user.id,
          item_id: office.id,
          item_type: "Office",
          fields: diff,
        });

        await version.save();
      }

      return res.status(200).json(office);
    } catch (e) {
      console.log("ERROR: ", e);

      return res.status(500).json({
        error_code: "UNKNOWN_ERROR",
        error_msg: error_codes["UNKNOWN_ERROR"],
      });
    }
  },

  delete: async (req, res, next) => {
    let { id } = req.params;

    if (!!id) {
      await Office.destroy({
        where: { id  },
      });
    }

    return res.status(200).json({ success: true });
  },
};

export default officeController;
