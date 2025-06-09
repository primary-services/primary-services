import { getSecret } from "../utils/aws.js";

export const config = async () => {
  if (process.env["NODE_ENV"] === "local") {
    return [
      {
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        define: {
          timestamps: true,
        },
      },
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
