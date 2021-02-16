const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");
const Employee = require("../models/employeeModel");

const router = express.Router();

router.get("/login", (req, res) => {
  res.send("login");
});

router.get("/logout", (req, res) => {
  // handle with passport
  res.send("logging out");
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "openid",
      "https://www.googleapis.com/auth/user.organization.read",
      "https://www.googleapis.com/auth/directory.readonly",
    ],
  })
);

router.get(
  "/google/redirect",
  passport.authenticate("google"),
  authController.createSendGoogleToken
);

module.exports = router;
