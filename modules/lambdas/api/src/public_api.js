"use strict";
console.log("Starting");
exports.handler = function (event, context, callback) {
    console.log("Event", event);

    var response = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ hello: "world" }),
    };

    callback(null, response);
};
