import { apiRoot } from "../../constants.js";

export const signupRoute = (args) => {
  return fetch(`${apiRoot}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...args }),
  }).then((resp) => {
    return resp.json();
  });
};

export const loginRoute = (args) => {
  return fetch(`${apiRoot}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...args }),
  }).then((resp) => {
    return resp.json();
  });
};
