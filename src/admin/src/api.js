export const getTowns = () =>
  fetch("http://127.0.0.1:5000/towns").then((response) => response.json());

export const getTown = (town_id) =>
  fetch(`http://127.0.0.1:5000/town/${town_id}`).then((response) =>
    response.json()
  );

export const getTownOffices = (town_id) =>
  fetch(`http://127.0.0.1:5000/town/${town_id}/offices`).then((response) =>
    response.json()
  );

export const getTownRequirements = (town_id) =>
  fetch(`http://127.0.0.1:5000/town/${town_id}/requirements`).then((response) =>
    response.json()
  );

export const createOffice = (town, office) =>
  fetch("http://127.0.0.1:5000/office", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...office, municipality_id: town.id }),
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
