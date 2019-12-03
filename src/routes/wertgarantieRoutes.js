var express = require('express');
var router = express.Router();
var googleController = require("../controllers/googleController.js");
var policyController = require("../controllers/policyController.js");
var shoppingCartController = require("../controllers/shoppingCartController.js");

router.get("/rating", googleController.reviewRatings);

router.get("/policies", policyController.policies);
router.get("/dummyPolicies", policyController.dummyPolicies);
router.get("/product", policyController.getProduct);

/**
 * TODO:
 * PUT /shop/:clientId/shoppingCarts/:shoppingCartId/confirmation => add confirmation
 * DELETE /shoppingCarts/:shoppingCartId/confirmation => remove confirmation
 * POST /shoppingCarts/ => create new shoppingCart
 * DELETE /shoppingCarts/:shoppingCartId => delete shoppingCart
 * POST /shoppingCarts/:shoppingCartId/products => add product to shopping cart
 * DELETE /shoppingCarts/:shoppingCartId/products/productId => remove product from shopping cart
 * GET /users/current/shoppingCarts/ => get all shopping carts for the current user
 */
router.get("/shoppingCart", shoppingCartController.showShoppingCart);
router.get("/shoppingCart/:clientId", shoppingCartController.getShoppingCartForClientId);
router.post("/shoppingCart/:clientId", shoppingCartController.addProductToShoppingCart);
router.delete("/shoppingCart/:clientId", shoppingCartController.removeProductFromShoppingCart);
router.put("/shoppingCart/:clientId/confirmation", shoppingCartController.confirmShoppingCart);
router.delete("/shoppingCart/:clientId/confirmation", shoppingCartController.unconfirmShoppingCart);

module.exports = router;
