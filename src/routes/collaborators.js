const express = require("express");
const router = express.Router();
const collaboratorController = require("../controllers/collaboratorController");
const User = require("../../src/db/models").User;

router.get("/wikis/:wikiId/collaborators", collaboratorController.show);
router.post("/wikis/:wikiId/collaborators/create", collaboratorController.create);
router.post("/wikis/:wikiId/collaborators/delete", collaboratorController.delete);

module.exports = router;
