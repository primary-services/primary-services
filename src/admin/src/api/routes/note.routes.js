import { apiRoot } from "../../constants.js";
import { fetchWithAuth } from "../../utils.js";

const routeMap = {
  municipality: "municipalities",
};

export const createNote = (args) => {
  let { item_id, item_type, note } = args;

  note.item_id = item_id;
  note.item_type = item_type;

  return fetchWithAuth(`${apiRoot}/${routeMap[item_type]}/${item_id}/note`, {
    method: "POST",
    body: JSON.stringify({ ...note }),
  }).then((resp) => {
    return resp.json();
  });
};

export const deleteNote = (args) => {
  let { item_id, item_type, note } = args;

  note.item_id = item_id;
  note.item_type = item_type;

  return fetchWithAuth(`${apiRoot}/${routeMap[item_type]}/${item_id}/note/${note.id}`, {
    method: "DELETE",
  }).then((resp) => {
    return resp.json();
  });
};
