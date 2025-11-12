import { apiRoot } from "./constants.js";
import { getCookie, fetchWithAuth } from "./utils.js";

export const getTowns = () =>
  fetchWithAuth(`${apiRoot}/municipalities/towns`).then((response) => response.json());

export const getTown = (town_id) =>
  fetchWithAuth(`${apiRoot}/town/${town_id}`).then((response) => response.json());

export const getTownOffices = (town_id) =>
  fetchWithAuth(`${apiRoot}/town/${town_id}/offices`).then((response) =>
    response.json(),
  );

export const getTownRequirements = (town_id) =>
  fetchWithAuth(`${apiRoot}/town/${town_id}/requirements`).then((response) =>
    response.json(),
  );

export const createOffice = (args) => {
  let { municipality_id, office } = args;
  // return fetch(`http://127.0.0.1:5000/municipality/${municipality_id}/office`, {
  return fetchWithAuth(`${apiRoot}/office`, {
    method: "POST",
    body: JSON.stringify({ ...office, municipality_id: municipality_id }),
  }).then((resp) => {
    return resp.json();
  });
};

export const deleteOffice = (office_id) => {

  return fetchWithAuth(`${apiRoot}/office/${office_id}`, {
    method: "DELETE",
  }).then((resp) => {
    return resp.json();
  });
};

export const createElection = (args) => {
  let { municipality_id, election } = args;

  return fetchWithAuth(`${apiRoot}/election`, {
    method: "POST",
    body: JSON.stringify({ ...election, municipality_id: municipality_id }),
  }).then((resp) => {
    return resp.json();
  });
};

export const createRequirement = (town, requirement) =>
  fetchWithAuth(`${apiRoot}/requirement`, {
    method: "POST",
    body: JSON.stringify({ ...requirement, municipality_id: town.id }),
  }).then((resp) => {
    return resp.json();
  });

export const updateTown = (town) =>
  fetchWithAuth(`${apiRoot}/municipalities/${town.id}`, {
    method: "POST",
    body: JSON.stringify({ ...town }),
  }).then((resp) => {
    return resp.json();
  });

//////////// Seat Separation /////////////

export const getMunicipality = (municipality_id) =>
  fetchWithAuth(`${apiRoot}/municipality/${municipality_id}`).then((response) =>
    response.json(),
  );

export const getMunicipalityOffices = (municipality_id) =>
  fetchWithAuth(`${apiRoot}/municipalities/${municipality_id}/offices`).then(
    (response) => response.json(),
  );

export const getMunicipalityElections = (municipality_id) =>
  fetchWithAuth(`${apiRoot}/municipalities/${municipality_id}/elections`).then(
    (response) => response.json(),
  );

export const getMunicipalityCollections = (municipality_id) =>
  fetchWithAuth(`${apiRoot}/municipalities/${municipality_id}/collections`).then(
    (response) => response.json(),
  );
