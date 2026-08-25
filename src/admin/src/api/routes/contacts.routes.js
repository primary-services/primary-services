import { apiRoot } from "../../constants.js";
import { fetchWithAuth } from "../../utils.js";

export const uploadContacts = (file) => {
  let formData = new FormData();
  formData.append("file", file);

  return fetchWithAuth(`${apiRoot}/contacts/upload`, {
    method: "POST",
    body: formData,
  }).then((resp) => {
    return resp.json();
  });
};

export const downloadContacts = () => {
  return fetchWithAuth(`${apiRoot}/contacts/download`, {
    method: "GET",
  }).then((resp) => {
    return resp.blob();
  });
};
