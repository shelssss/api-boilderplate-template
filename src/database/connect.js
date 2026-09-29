// Database connection lives in its own module, isolated from app.js, and is
// called AFTER the HTTP server starts listening — so "can this process
// accept a socket" stays decoupled from "can this process reach the DB".
//
// No database is wired yet. When you pick one, replace the body of
// connectDB() below. A couple of drop-in examples:
//
// --- MongoDB (Mongoose) ---
//   const mongoose = require("mongoose");
//   const connectDB = async () => {
//     await mongoose.connect(DB_URI);
//     console.log("MongoDB connected");
//   };
//
// --- PostgreSQL (Prisma) ---
//   const { PrismaClient } = require("@prisma/client");
//   const prisma = new PrismaClient();
//   const connectDB = async () => {
//     await prisma.$connect();
//     console.log("Postgres connected via Prisma");
//   };
//   module.exports = { connectDB, prisma };
//
// Whichever you choose, keep the models/ layer talking to it — never let
// controllers import a DB client directly.

const { DB_URI } = require("../config/env");

async function connectDB() {
  if (!DB_URI) {
    console.log("[database] No DB_URI set — running without a database.");
    return;
  }
  // TODO: connect to DB_URI with your chosen driver/ORM here.
  console.log("[database] DB_URI is set, but no driver is wired up yet.");
}

async function disconnectDB() {
  // TODO: close the real connection here once one exists (used on
  // graceful shutdown — see app.js).
}

module.exports = { connectDB, disconnectDB };
