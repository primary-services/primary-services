import fs from "fs";
import path from "path";
import Showdown from "showdown";

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
};

export default utilsController;
