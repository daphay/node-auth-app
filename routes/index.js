const express = require("express");
const router = express.Router();
const { enforceAuthenticated } = require("../config/auth");

//Home Page
router.get("/", (req, res) => res.render("home"));

// Dashboard Page
router.get("/dashboard", enforceAuthenticated, (req, res) =>
  res.render("dashboard",  {
      name: req.user.name
  })
);

module.exports = router;
