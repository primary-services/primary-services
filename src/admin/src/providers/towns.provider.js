// Import package components
import { createContext, useState } from "react";

// import { TownList } from "../temp/towns.js";

export const TownsContext = createContext();
export const TownsProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [towns, setTowns] = useState([]);

  // This is all just test data
  const [deadlines, setDeadlines] = useState([
    {
      id: 0,
      town_id: 0,
      office_id: 0,
      label: "Form Submission",
      description: "All forms must be submitted to the Town Clerk by 5pm",
      deadline: "2025-07-01 17:00:00",
    },
    {
      id: 0,
      town_id: 0,
      label: "Accounting Paperwork",
      description: "All campaign accounting must be filed with the Town Clerk",
      deadline: "2025-09-21 17:00:00",
    },
  ]);
  const [requirements, setRequirements] = useState([
    {
      id: 0,
      town_id: 0,
      label: "Signatures Required",
      description:
        "Every candidate must gather 50 signatures from adult legal residents of Town. Signature forms must be picked up at town hall",
      form: null,
    },
  ]);
  const [responsibilities, setResponsibilities] = useState([
    {
      id: 0,
      town_id: 0,
      label: "Conflict of Interests",
      description:
        "All candidates must fill out form 26J listing all potential conflict of interests",
      deadline: {
        id: 0,
      },
      form: {
        id: 0,
      },
    },
  ]);
  const [forms, setForms] = useState([
    {
      id: 0,
      label: "26J: Conflict of Interest Declaration",
      description:
        "Form 26J can be picked up from the town clerk, or printed out. You must list all potential conflict of interests on this form. A conflict of interest does not bar you from holding any office, but it must be declared beforehand. Failure to disclose can result in potential criminial libability",
      url: "https://example.com",
    },
  ]);

  const townContext = {
    // Properties
    loading,
    towns,

    deadlines,
    requirements,
    responsibilities,
    forms,

    // Methods
    getTowns: async () => {
      const resp = await fetch("http://127.0.0.1:5000/towns");
      const list = await resp.json();

      console.log(list);

      setTowns(list);
    },

    getTown: (name) => {},

    updateTown: (town) => {},

    // createTown: async (town) => {
    //   const resp = await fetch("http://127.0.0.1:5000/town", {
    //     method: "POST",
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(town),
    //   });

    //   return resp.json();
    // },
  };

  return (
    <TownsContext.Provider value={townContext}>
      {children}
    </TownsContext.Provider>
  );
};
