const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Welcome to Blocipedia");
});

module.exports = router;
