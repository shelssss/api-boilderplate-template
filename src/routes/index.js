// One place that mounts every resource router. app.js only imports this
// file, not each router individually — adding a new resource means editing
// here, not app.js.

const { Router } = require("express");
const router = Router();

router.use("/health", require("./health.routes"));
router.use("/auth", require("./auth.routes"));
router.use("/items", require("./items.routes"));

module.exports = router;
