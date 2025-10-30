export const apiRoot =
  process.env.NODE_ENV === "production"
    ? // ? "https://api.deadlykitten.com"
      "https://api.mademocracy.com"
    : "http://localhost:5000";
