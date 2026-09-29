const { Router } = require("express");
const router = Router();

const { signUp, signIn } = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");

const checkSignUp = (body) => {
  const errors = [];
  if (!body.name) errors.push("name is required");
  if (!body.email) errors.push("email is required");
  if (!body.password || body.password.length < 8) {
    errors.push("password is required and must be at least 8 characters");
  }
  return errors;
};

const checkSignIn = (body) => {
  const errors = [];
  if (!body.email) errors.push("email is required");
  if (!body.password) errors.push("password is required");
  return errors;
};

router.post("/sign-up", validate(checkSignUp), signUp);
router.post("/sign-in", validate(checkSignIn), signIn);

module.exports = router;
