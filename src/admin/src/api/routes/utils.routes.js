import { apiRoot } from "../../constants.js";

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
