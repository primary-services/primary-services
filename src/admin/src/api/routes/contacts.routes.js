import { apiRoot } from "../../constants.js";
import { fetchWithAuth } from "../../utils.js";

export const uploadContacts = (file) => {
  let formData = new FormData();
  formData.append("file", file);

  return fetchWithAuth(`${apiRoot}/contacts/upload`, {
    method: "POST",
    body: formData,
  }).then(async (resp) => {
    let data = await resp.json();

    if (!resp.ok) {
      throw new Error(data.error || data.error_msg || "Failed to upload contacts");
    }

    return data;
  });
};

export const downloadContacts = () => {
  return fetchWithAuth(`${apiRoot}/contacts/download`, {
    method: "GET",
  }).then(async (resp) => {
    if (!resp.ok) {
      throw new Error("Failed to download contacts");
    }

    return resp.blob();
  });
};
