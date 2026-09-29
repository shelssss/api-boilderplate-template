// Centralized config. Every other file imports named values from here —
// nothing else in the app should read process.env directly.

require("dotenv").config();

const {
  NODE_ENV = "development",
  PORT = 5000,
  JWT_SECRET,
  JWT_EXPIRES_IN = "1d",
  CORS_ORIGIN = "*",
  RATE_LIMIT_WINDOW_MS = 60000,
  RATE_LIMIT_MAX = 100,
  DB_URI,
} = process.env;

if (NODE_ENV === "production" && (!JWT_SECRET || JWT_SECRET.length < 16)) {
  // Fail loudly at startup rather than issuing insecure tokens silently.
  throw new Error("JWT_SECRET must be set to a strong value in production.");
}

module.exports = {
  NODE_ENV,
  PORT: Number(PORT),
  JWT_SECRET: JWT_SECRET || "dev-only-secret-change-me",
  JWT_EXPIRES_IN,
  CORS_ORIGIN: CORS_ORIGIN.split(",").map((origin) => origin.trim()),
  RATE_LIMIT_WINDOW_MS: Number(RATE_LIMIT_WINDOW_MS),
  RATE_LIMIT_MAX: Number(RATE_LIMIT_MAX),
  DB_URI,
};
