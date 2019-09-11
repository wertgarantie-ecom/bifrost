var express = require('express');
var router = express.Router();
var googleController = require("../controllers/googleController.js");
var wertgarantieController = require("../controllers/wertgarantieController.js");

router.get("/rating", googleController.reviewRatings);
router.get("/policies", wertgarantieController.policies);

module.exports = router;
