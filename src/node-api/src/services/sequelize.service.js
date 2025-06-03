import { Sequelize } from "sequelize";

import { config } from "../config/database.js";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();

const modelFiles = fs
  .readdirSync(__dirname + "/src/models/")
  .filter((file) => file.endsWith(".js"));

const sequelizeService = {
  init: async () => {
    try {
      const [databaseConfig, databaseConfigErr] = await config();

      if (databaseConfigErr !== null) {
        console.log("Error loading database config");
      }

      console.log(databaseConfig);

      const connection = new Sequelize(databaseConfig);

      /*
        Loading models automatically
      */

      for (const file of modelFiles) {
        const model = await import(`../models/${file}`);
        if (!!model.default.init) {
          model.default.init(connection);
        }
      }

      for (const file of modelFiles) {
        const model = await import(`../models/${file}`);
        if (!!model.default.associate) {
          model.default.associate && model.default.associate(connection.models);
        }
      }

      console.log("[SEQUELIZE] Database service initialized");
    } catch (error) {
      console.log("[SEQUELIZE] Error during database service initialization");
      throw error;
    }
  },
};

export default sequelizeService;
