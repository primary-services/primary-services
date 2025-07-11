// Import package components
import { createContext, useState } from "react";

// import { TownList } from "../temp/towns.js";

export const TownsContext = createContext();
export const TownsProvider = ({ children }) => {
  const [loading, setLoading] = useState({});
  const [towns, setTowns] = useState([]);
  const [town, setTown] = useState(null);

  // This is all just test data
  const [deadlines, setDeadlines] = useState([
    {
      id: 15,
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
      id: 9,
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
    town,

    deadlines,
    requirements,
    responsibilities,
    forms,

    // Methods
    getTowns: async () => {
      setLoading((prev) => ({ ...prev, getTowns: true }));
      const resp = await fetch("http://127.0.0.1:5000/towns");
      const list = await resp.json();

      setTowns(list);
      setLoading((prev) => ({ ...prev, getTowns: false }));
    },

    getTown: async (id) => {
      const town = await fetch(`http://127.0.0.1:5000/town/${id}`).then(
        (resp) => resp.json(),
      );

      setTown(town);
    },

    createOffice: async (town, office) => {
      // console.log(office);

      // office = {
      //   id: 385,
      //   title: "Testing",
      //   description: "Testing Office Update",
      //   salary: "50000",
      //   commitment_min: "20",
      //   commitment_max: "25",
      //   terms: [
      //     {
      //       id: null,
      //       start: "2025-01-01",
      //       end: "2026-01-01",
      //       incumbents: [],
      //       election: {
      //         id: null, // TODO: ADD
      //         polling_date: "2025-01-01",
      //         seat_count: 1,
      //         type: "GENERAL", // TODO: ADD
      //         candidates: [],
      //         deadlines: [
      //           {
      //             id: null,
      //             label: "Term 1 Deadline",
      //             description: "Term 1 Deadline",
      //             deadline: "2025-01-01",
      //           },
      //         ],
      //         requirements: [
      //           {
      //             id: null,
      //             label: "Test Requirement",
      //             description: "Testing Requirements",
      //             form: {
      //               id: null,
      //               label: "Requirement Form",
      //               description: "Testing Requirement Form",
      //               url: "https://example.com",
      //             },
      //             deadline: {
      //               id: null,
      //               label: "Requirement Deadline",
      //               description: "Testing Requirement Deadline",
      //               deadline: "2025-01-01",
      //             },
      //           },
      //         ],
      //         responsibilities: [],
      //         forms: [
      //           {
      //             id: null,
      //             label: "Term 1 Form",
      //             description: "Term 1 Testing Form",
      //             url: "https://example-form.com",
      //           },
      //         ],
      //         notes: [],
      //       },
      //     },
      //   ],
      // };

      console.log(town);
      console.log(office);

      setLoading((prev) => ({ ...prev, createOffice: true }));
      let officeResp = await fetch("http://127.0.0.1:5000/office", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...office, municipality_id: town.id }),
      }).then((resp) => {
        return resp.json();
      });
      setLoading((prev) => ({ ...prev, createOffice: false }));

      console.log(officeResp);

      let requirements = [];
      let deadlines = [];
      let forms = [];
      let terms = [...office.terms];

      terms.map((term) => {
        let election = term.election;

        requirements = [...(election.requirements || [])];
        deadlines = [...(election.deadlines || [])];
        forms = [...(election.forms || [])];
      });

      requirements.map((requirement) => {
        if (!!requirement.deadline) {
          deadlines.push(requirement.deadline);
        }

        if (!!requirement.form) {
          forms.push(requirement.form);
        }
      });

      console.log(office);
      console.log(terms);
      console.log(requirements);
      console.log(deadlines);
      console.log(forms);

      // const resp = await fetch("http://127.0.0.1:5000/office", {
      //   method: "POST",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(town),
      // });

      // return resp.json();
    },

    createRequirement: (requirement) => {
      console.log(requirement);
    },

    createDeadline: (deadline) => {
      console.log(deadline);
    },

    createForm: (form) => {
      console.log(form);
    },

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
