var express = require('express');
var router = express.Router();
var googleController = require("../controllers/googleController.js");
var policyController = require("../controllers/policyController.js");
var shoppingCartController = require("../controllers/shoppingCartController.js");

router.get("/rating", googleController.reviewRatings);

router.get("/policies", policyController.policies);
router.get("/dummyPolicies", policyController.dummyPolicies);
router.get("/product", policyController.getProduct);

router.get("/shoppingCart", shoppingCartController.showShoppingCart);
router.get("/shoppingCart/:clientId", shoppingCartController.getShoppingCartForClientId);
router.post("/shoppingCart/:clientId", shoppingCartController.addProductToShoppingCart);
router.delete("/shoppingCart/:clientId", shoppingCartController.removeProductFromShoppingCart);

module.exports = router;
