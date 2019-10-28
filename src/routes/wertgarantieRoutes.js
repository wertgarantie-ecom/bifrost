var express = require('express');
var router = express.Router();
var googleController = require("../controllers/googleController.js");
var policyController = require("../controllers/policyController.js");
var shoppingCartController = require("../controllers/shoppingCartController.js");

router.get("/rating", googleController.reviewRatings);

router.get("/policies", policyController.policies);
router.get("/dummyPolicies", policyController.dummyPolicies);

router.get("/shoppingCart", shoppingCartController.showShoppingCart);
router.post("/shoppingCart", shoppingCartController.addProductToShoppingCart);

module.exports = router;
