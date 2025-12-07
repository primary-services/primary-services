import { apiRoot } from "../../constants.js";
import { fetchWithAuth } from "../../utils.js";

const routeMap = {
  municipality: "municipalities",
};

export const createSource = (args) => {
  let { item_id, item_type, source } = args;

  source.item_id = item_id;
  source.item_type = item_type;

  return fetchWithAuth(`${apiRoot}/${routeMap[item_type]}/${item_id}/source`, {
    method: "POST",
    body: JSON.stringify({ ...source }),
  }).then((resp) => {
    return resp.json();
  });
};

export const deleteSource = (args) => {
  let { item_id, item_type, source } = args;

  source.item_id = item_id;
  source.item_type = item_type;

  return fetchWithAuth(
    `${apiRoot}/${routeMap[item_type]}/${item_id}/source/${source.id}`,
    {
      method: "DELETE",
    },
  ).then((resp) => {
    return resp.json();
  });
};
