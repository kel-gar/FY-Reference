const express = require("express");
const router = express.Router();

const User = require("../../src/db/models").User;
const userController = require("../controllers/userController");
// const validation = require("./validation");

router.get("/users/sign_up", userController.signUp);
// router.post("/users", validation.validateUsers, userController.create);

module.exports = router;
