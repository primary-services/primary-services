import { apiRoot } from "../../constants.js";
import { fetchWithAuth } from "../../utils.js";

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

export const createWard = (args) => {
  return fetchWithAuth(
    `${apiRoot}/municipalities/${args.municipality_id}/ward`,
    {
      method: "POST",
      body: JSON.stringify({ ...args }),
    },
  ).then((resp) => {
    return resp.json();
  });
};

export const deleteWard = (args) => {
  return fetchWithAuth(
    `${apiRoot}/municipalities/${args.municipality_id}/ward/${args.id}`,
    {
      method: "DELETE",
    },
  ).then((resp) => {
    return resp.json();
  });
};
