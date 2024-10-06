const {
  signup,
  login,
  forgetPassword,
  resetPassword,
} = require("../Controllers/AuthController");
const {
  signupValidation,
  loginValidation,
} = require("../Middleware/Validation");
const express = require("express");
const router = express.Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword/:token", resetPassword);

module.exports = router;
