// Import package components
import { createContext, useState } from "react";

import { TownList } from "../temp/towns.js";

export const TownsContext = createContext();
export const TownsProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [towns, setTowns] = useState({});

  const getTowns = () => {
    setTowns(TownList);
  };

  const getTown = (name) => {};

  const updateTown = (town) => {};

  const townContext = {
    // Properties
    loading,
    towns,

    // Methods
    getTowns,
    getTown,
    updateTown,
  };

  return (
    <TownsContext.Provider value={townContext}>
      {children}
    </TownsContext.Provider>
  );
};
