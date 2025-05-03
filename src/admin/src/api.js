export const getTowns = () =>
  fetch("http://127.0.0.1:5000/towns").then((response) => response.json());

export const getTown = (town_id) =>
  fetch(`http://127.0.0.1:5000/town/${town_id}`).then((response) =>
    response.json(),
  );

export const getTownOffices = (town_id) =>
  fetch(`http://127.0.0.1:5000/town/${town_id}/offices`).then((response) =>
    response.json(),
  );

export const getTownRequirements = (town_id) =>
  fetch(`http://127.0.0.1:5000/town/${town_id}/requirements`).then((response) =>
    response.json(),
  );

export const createOffice = (municipality, office) =>
  fetch("http://127.0.0.1:5000/office", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...office, municipality_id: municipality.id }),
  }).then((resp) => {
    return resp.json();
  });

export const createElection = (municipality, election) =>
  fetch("http://127.0.0.1:5000/election", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...election, municipality_id: municipality.id }),
  }).then((resp) => {
    return resp.json();
  });

export const createRequirement = (town, requirement) =>
  fetch("http://127.0.0.1:5000/requirement", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...requirement, municipality_id: town.id }),
  }).then((resp) => {
    return resp.json();
  });

//////////// Seat Separation /////////////

export const getMunicipality = (municipality_id) =>
  fetch(`http://127.0.0.1:5000/municipality/${municipality_id}`).then(
    (response) => response.json(),
  );

export const getMunicipalityOffices = (municipality_id) =>
  fetch(`http://127.0.0.1:5000/municipality/${municipality_id}/offices`).then(
    (response) => response.json(),
  );

export const getMunicipalityElections = (municipality_id) =>
  fetch(`http://127.0.0.1:5000/municipality/${municipality_id}/elections`).then(
    (response) => response.json(),
  );
