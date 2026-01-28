const express = require("express");
const { listMatches } = require("../controllers/matchController");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.get("/", authenticate, listMatches);

module.exports = router;
