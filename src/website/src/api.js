const apiRoot =
  process.env.NODE_ENV === "production" || import.meta.env.MODE === "production"
    ? "https://api.mademocracy.com"
    : "http://localhost:5000";

export const getTowns = () =>
  fetch(`${apiRoot}/municipalities/towns`).then((response) => response.json());

export const getCollections = (townId) =>
  fetch(`${apiRoot}/municipalities/${townId}/collections`).then((response) =>
    response.json(),
  );

export const getOffices = (townId) =>
  fetch(`${apiRoot}/municipalities/${townId}/offices`).then((response) =>
    response.json(),
  );
