export const apiRoot =
  process.env.NODE_ENV === "production"
    ? "https://api.deadlykitten.com"
    : "http://localhost:5000";
