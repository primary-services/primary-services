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

export const createOffice = (args) => {
  let { municipality_id, office } = args;
  console.log(municipality_id, office);
  return fetch(`http://127.0.0.1:5000/municipality/${municipality_id}/office`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...office }),
  }).then((resp) => {
    return resp.json();
  });
};

export const createElection = (args) => {
  let { municipality_id, election } = args;

  return fetch(
    `http://127.0.0.1:5000/municipality/${municipality_id}/election`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...election }),
    },
  ).then((resp) => {
    return resp.json();
  });
};

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
