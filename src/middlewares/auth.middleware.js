// Attach this to individual routes that need a verified identity
// (router.post("/", authenticate, createItem)) — never mount it globally
// in app.js. That keeps public routes (sign-up, sign-in, health) reachable
// without special-casing them.

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const { findUserById } = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(401, "Authentication token missing.");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired token.");
  }

  const user = await findUserById(decoded.sub);
  if (!user) {
    throw new ApiError(401, "User for this token no longer exists.");
  }

  req.user = { id: user.id, email: user.email, name: user.name };
  next();
});

module.exports = authenticate;
