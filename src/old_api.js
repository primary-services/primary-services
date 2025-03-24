// import { initDB } from "./db.js";

const Pool = require("pg-pool");
const { SecretsManager } = require("@aws-sdk/client-secrets-manager");

const getPool = (creds) => {
  return new Pool({
    max: 1,
    min: 0,
    idleTimeoutMillis: 120000,
    connectionTimeoutMillis: 10000,
    database: creds.database,
    user: creds.user,
    password: creds.password,
    host: creds.host,
    port: 5432,
    ssl: {
      rejectUnauthorized: false,
    },
  });
};

const getSecret = () => {
  const region = "us-east-2";
  const rdsSecretName = process.env["DBSecret"];
  const secretsClient = new SecretsManager({
    region: region,
  });

  return new Promise((resolve, reject) => {
    secretsClient.getSecretValue({ SecretId: rdsSecretName }, (err, data) => {
      if (err) {
        return reject(err);
      } else {
        return resolve([JSON.parse(data.SecretString), null]);
      }
    });
  });
};

let api = require("lambda-api")();
let db = null;

// Define a route
api.get("/", async (req, res) => {
  res.status(200).jsonp({
    stub: "This should return the OpenAPI doc with the API's specifications",
  });
});

// Town methods
api.get("/towns", async (req, res) => {
  res.status(200).jsonp({
    stub: "Town List",
  });
});

api.get("/town/:id", async (req, res) => {
  res.status(200).jsonp({
    stub: "Town Data",
  });
});

api.put("/town/:id", async (req, res) => {
  res.status(200).jsonp({
    stub: "Update Town Data",
  });
});

// Office Methods
api.get("/offices", async (req, res) => {
  res.status(200).jsonp({
    stub: "Get the list of office templates",
  });
});

api.post("/offices", async (req, res) => {
  res.status(200).jsonp({
    stub: "Create an office template",
  });
});

api.put("/offices/:id", async (req, res) => {
  res.status(200).jsonp({
    stub: "Create an office template",
  });
});

api.delete("/offices/:id", async (req, res) => {
  res.status(200).jsonp({
    stub: "Delete an office template",
  });
});

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; // !important to reuse pool

  let creds = await getSecret().catch((e) => console.log(e));
  let pool = await getPool(creds).catch((e) => console.log(e));

  db = await pool.connect();

  await api.run(event, context);
  return db.release(true);
};
