var express = require('express');
var router = express.Router();
var googleController = require("../controllers/googleController.js");
var wertgarantieController = require("../controllers/wertgarantieController.js");
var cors = require("cors");

router.options("/rating", cors(), function (req, res, next) {
    next();
});

router.get("/rating", cors(), googleController.reviewRatings);

router.get("/policies", cors(), wertgarantieController.policies);

module.exports = router;
