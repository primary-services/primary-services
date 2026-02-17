import fs from "fs";
import path from "path";
import Showdown from "showdown";

import Flag from "../models/flag.model.js";

const __dirname = path.resolve();

let utilsController = {
  fetch_markdown: async (req, res, next) => {
    const Converter = new Showdown.Converter();
    const { file_name } = req.params;

    const files = {
      office_instructions: "/src/markdown/office-instructions.md",
    };

    const filePath = files[file_name];

    if (!filePath) {
      return res
        .status(404)
        .json({ success: false, error: "Unknown Markdown" });
    }

    const fileContents = fs.readFileSync(__dirname + filePath).toString();
    const html = Converter.makeHtml(fileContents);

    res.status(200).json({
      success: true,
      html: html,
      markdown: fileContents,
    });
  },

  toggle_flag: async (req, res, next) => {
    let { item_id, item_type, name } = req.body;
    let user = req.jwt?.user || null;

    if (!user) {
      return res.status(401).json({
        error_code: "UNAUTHORIZED",
        error_msg: error_codes["UNAUTHORIZED"],
      });
    }

    let existing = await Flag.findOne({
      where: {
        item_id,
        item_type,
        name,
      },
    });

    try {
      if (existing === null) {
        await Flag.create({
          item_id,
          item_type,
          name,
        });
      } else {
        await existing.destroy();
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({ success: false, error: "Unknown Error" });
    }

    return res.status(200).json({ success: true });
  },
};

export default utilsController;
