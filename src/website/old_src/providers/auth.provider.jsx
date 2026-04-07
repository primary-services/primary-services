// Import package components
import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // TODO: Null this
  const [address, setAddress] = useState({
    country: "United States",
    country_code: "us",
    state: "Massachusetts",
    county: "Plymouth County",
    city: "Abington",
    datasource: {
      sourcename: "openstreetmap",
      attribution: "© OpenStreetMap contributors",
      license: "Open Database License",
      url: "https://www.openstreetmap.org/copyright",
    },
    state_code: "MA",
    lon: -70.9453218,
    lat: 42.1048228,
    population: 16378,
    result_type: "city",
    formatted: "Abington, MA, United States of America",
    address_line1: "Abington, MA",
    address_line2: "United States of America",
    category: "administrative",
    timezone: {
      name: "America/New_York",
      offset_STD: "-05:00",
      offset_STD_seconds: -18000,
      offset_DST: "-04:00",
      offset_DST_seconds: -14400,
      abbreviation_STD: "EST",
      abbreviation_DST: "EDT",
    },
    plus_code: "87JF4333+WV",
    plus_code_short: "+WV Abington, Plymouth County, United States",
    iso3166_2: "US-MA",
    rank: {
      confidence: 1,
      confidence_city_level: 1,
      match_type: "full_match",
    },
    place_id:
      "5189cc012780bc51c05905f060d56a0d4540f00101f9013b8e240000000000c00208",
  });

  const [user, setUser] = useState({
    first_name: "Test",
    last_name: "Data",
    email: "test_data@gmail.com",
    phone: "",
  });

  const authContext = {
    address,
    setAddress,
    user,
    setUser,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};
