var express = require('express');
var router = express.Router();
var googleController = require("../controllers/googleController.js");

router.get("/rating", googleController.reviewRatings);

module.exports = router;
