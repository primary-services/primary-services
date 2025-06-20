export const apiRoot =
  process.env.NODE_ENV === "production"
    ? "https://api.deadlykitten.com"
    : "http://127.0.0.1:5000";
