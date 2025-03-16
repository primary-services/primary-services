import postgres from "postgres";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

const region = "us-east-2";
const rdsSecretName = process.env["DBSecret"];
const client = new SecretsManager({
  region: region,
});

let queries = {};

const getToken = () => {
  return new Promise((resolve, reject) => {
    client.getSecretValue({ SecretId: rdsSecretName }, function (err, data) {
      if (err) {
        console.log(err);
        resolve([null, err]);
      } else {
        if ("SecretString" in data) {
          resolve([JSON.parse(data.SecretString), null]);
          return;
        }
      }

      resolve([null, "Unknown Error"]);
    });
  });
};

const connect = async () => {
  let [creds, err] = await getToken();
  if (err !== null) {
    console.log("Error fetching credentials:", err);
    return null;
  }

  let conStr = `postgres://${creds.username}:${creds.password}@${creds.host}:${creds.port}/${creds.database}`;

  let sql = postgres(conStr, {
    max: 1,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  let proxy = function () {
    return new Promise(async (res, rej) => {
      var query = arguments[0].join(" ").trim(),
        command = query.split(" ")[0];

      if (/^(UPDATE)|(DELETE)/i.test(command)) {
        if (!/(WHERE)/gim.test(query)) {
          return res([
            null,
            "ERROR: UPDATE or DELETE statement called without a where clause",
          ]);
        }
      }

      sql(...arguments)
        .then((result) => {
          res([result, null]);
        })
        .catch((err) => {
          res([null, err]);
        });
    });
  };

  proxy = Object.assign(proxy, sql);
  proxy = Object.assign(proxy, {
    native: sql,
    first: async function () {
      let [rows, err] = await proxy(...arguments);

      if (!!err) {
        return [null, err];
      } else {
        return [(rows || [])[0] || null, null];
      }
    },
  });
  proxy = Object.assign(proxy, {
    begin: async (fn) => {
      return sql.begin((transaction) => {
        let transactionProxy = function () {
          return new Promise(async (res, rej) => {
            var query = arguments[0].join(" ").trim(),
              command = query.split(" ")[0];

            if (/^(UPDATE)|(DELETE)/i.test(command)) {
              if (!/(WHERE)/gim.test(query)) {
                return res([
                  null,
                  "ERROR: UPDATE or DELETE statement called without a where clause. Past Joel just saved your ass",
                ]);
              }
            }

            transaction(...arguments)
              .then((result) => {
                res([result, null]);
              })
              .catch((err) => {
                res([null, err]);
              });
          });
        };

        transactionProxy = Object.assign(transactionProxy, transaction);
        transactionProxy = Object.assign(transactionProxy, {
          native: transaction,
          first: async function () {
            let [rows, err] = await transaction(...arguments);
            if (Array.isArray(rows)) {
              return [rows[0] || null, null];
            } else {
              return [rows || null, null];
            }
          },
        });

        return fn(transactionProxy);
      });
    },
  });

  return proxy;
};

export const initDB = async () => {
  console.log("Connecting");
  return connect().catch((err) => {
    console.log("Error connecting:", err);
  });
};
