export const apiRoot =
  process.env.NODE_ENV === "production"
    ? "https://api.mademocracy.com"
    : "http://localhost:5000";
