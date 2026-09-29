const { Router } = require("express");
const router = Router();

const {
  getItems,
  getItem,
  postItem,
  putItem,
  removeItem,
} = require("../controllers/items.controller");
const authenticate = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const checkCreateItem = (body) => {
  const errors = [];
  if (!body.name || typeof body.name !== "string") errors.push("name is required");
  return errors;
};

// Public reads
router.get("/", getItems);
router.get("/:id", getItem);

// Protected writes — auth middleware applied per-route, not globally
router.post("/", authenticate, validate(checkCreateItem), postItem);
router.put("/:id", authenticate, validate(checkCreateItem), putItem);
router.delete("/:id", authenticate, removeItem);

module.exports = router;
