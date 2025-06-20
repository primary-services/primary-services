import { apiRoot } from "../../constants.js";

const routeMap = {
  municipality: "municipalities",
};

export const createNote = (args) => {
  let { item_id, item_type, note } = args;

  note.item_id = item_id;
  note.item_type = item_type;

  return fetch(`${apiRoot}/${routeMap[item_type]}/${item_id}/note`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...note }),
  }).then((resp) => {
    return resp.json();
  });
};

export const deleteNote = (args) => {
  let { item_id, item_type, note } = args;

  note.item_id = item_id;
  note.item_type = item_type;

  return fetch(`${apiRoot}/${routeMap[item_type]}/${item_id}/note/${note.id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((resp) => {
    return resp.json();
  });
};
