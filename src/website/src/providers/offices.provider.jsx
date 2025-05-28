// Import package components
import { createContext, useState } from "react";

export const OfficeContext = createContext();
export const OfficeProvider = ({ children }) => {
  const API_ROOT = import.meta.env.VITE_API_ROOT;

  const [offices, setOffices] = useState([]);
  const officeContext = {
    offices,

    getOffices: async (city) => {
      return fetch(`${API_ROOT}/offices/${city}`).then(async (resp) => {
        let json = await resp.json();
        setOffices(json);
        return json;
      });
    },
  };

  return (
    <OfficeContext.Provider value={officeContext}>
      {children}
    </OfficeContext.Provider>
  );
};
