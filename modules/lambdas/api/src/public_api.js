// import { initDB } from "./db.js";

const Pool = require("pg-pool");

// connection details inherited from environment
const pool = new Pool({
    max: 1,
    min: 0,
    idleTimeoutMillis: 120000,
    connectionTimeoutMillis: 10000,
    database: "elections",
    user: "postgres",
    password: "xzy.dqj0TDM6vzh8bpt",
    host: "ma-elections-postgres-db.czyciks8cmhz.us-east-2.rds.amazonaws.com",
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
    },
});

exports.handler = async function (event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false; // !important to reuse pool

    const client = await pool.connect();

    let resp;
    try {
        resp = await client.query("SELECT * FROM example");
    } finally {
        client.release(true);
    }

    var response = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(resp.rows),
    };

    callback(null, response);
};
