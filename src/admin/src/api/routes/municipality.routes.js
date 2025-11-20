import { apiRoot } from "../../constants.js";

const routeMap = {
  municipality: "municipalities",
};

export const getCompletion = (args) => {
  return fetch(`${apiRoot}/municipalities/completion`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((resp) => {
    return resp.json();
  });
};
