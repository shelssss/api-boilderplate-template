// Entry point. This file does exactly three things: register middleware in
// the right order, mount routes under a versioned prefix, and start the
// server before connecting to the database. No business logic lives here.

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const { PORT, NODE_ENV, CORS_ORIGIN } = require("./config/env");
const { helmetMiddleware, rateLimiter } = require("./middlewares/security.middleware");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/error.middleware");
const { connectDB, disconnectDB } = require("./database/connect");
const routes = require("./routes");

const app = express();

// --- 1. Body/cookie parsing ---
app.use(express.json());
app.use(cookieParser());

// --- 2. Security (cheap, universal checks before anything else) ---
app.use(helmetMiddleware);
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(rateLimiter);
if (NODE_ENV !== "test") {
  app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
}

// --- 3. Routes ---
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running.", env: NODE_ENV });
});
app.use("/api/v1", routes);

// --- 4. 404 + centralized error handling (mounted last) ---
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, async () => {
  console.log(`[app] Listening on port ${PORT} (${NODE_ENV})`);
  // DB connection happens AFTER the server accepts connections — see
  // src/database/connect.js for why.
  await connectDB();
});

// --- Graceful shutdown ---
async function shutdown(signal) {
  console.log(`[app] ${signal} received, shutting down gracefully...`);
  server.close(async () => {
    await disconnectDB();
    console.log("[app] Shutdown complete.");
    process.exit(0);
  });
  // Force-exit if close() hangs (e.g. a stuck connection).
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

module.exports = app;
