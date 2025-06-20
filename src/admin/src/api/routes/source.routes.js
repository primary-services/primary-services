import { apiRoot } from "../../constants.js";

const routeMap = {
  municipality: "municipalities",
};

export const createSource = (args) => {
  let { item_id, item_type, source } = args;

  source.item_id = item_id;
  source.item_type = item_type;

  return fetch(`${apiRoot}/${routeMap[item_type]}/${item_id}/source`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...source }),
  }).then((resp) => {
    return resp.json();
  });
};

export const deleteSource = (args) => {
  let { item_id, item_type, source } = args;

  source.item_id = item_id;
  source.item_type = item_type;

  return fetch(
    `${apiRoot}/${routeMap[item_type]}/${item_id}/source/${source.id}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  ).then((resp) => {
    return resp.json();
  });
};
