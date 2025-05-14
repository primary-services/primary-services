import "dotenv/config";

export default {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
  },
};
