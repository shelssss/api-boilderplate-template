const { Router } = require("express");
const router = Router();

// Liveness: is the process up at all.
router.get("/", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// Readiness: can it actually serve traffic (DB reachable, etc.). Wire in a
// real check once database/connect.js does something.
router.get("/ready", (req, res) => {
  res.status(200).json({ status: "ok", db: "not configured" });
});

module.exports = router;
