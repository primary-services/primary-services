import { apiRoot } from "../../constants.js";
import { fetchWithAuth } from "../../utils.js";

export const fetchMarkdown = (file_name) => {
  return fetch(`${apiRoot}/utils/fetch_markdown/${file_name}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((resp) => {
    return resp.json();
  });
};

export const toggleFlag = ({ item_id, item_type, name }) => {
  return fetchWithAuth(`${apiRoot}/utils/toggle_flag`, {
    method: "POST",
    body: JSON.stringify({ item_id, item_type, name }),
  });
};
