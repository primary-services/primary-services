import { getSecret } from "../utils/aws.js";
import { default as staticConfig } from "../../config/config.json" assert { type: "json" };

export const config = async () => {
  if (!process.env["DBSecret"]) {
    return [
      staticConfig[process.env.NODE_ENV || "local"],
      null,
    ];
  }

  let [creds, error] = await getSecret(process.env["DBSecret"]);

  if (error !== null) {
    return [null, error];
  }

  return [
    {
      dialect: "postgres",
      host: creds.host,
      user: creds.username,
      username: creds.username,
      password: creds.password,
      database: creds.database,
      define: {
        timestamps: true,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      pool: {
        max: 2,
        min: 0,
        idle: 10000,
      },
    },
    null,
  ];
};
