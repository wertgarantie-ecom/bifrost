const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const googleController = require("../controllers/googleController.js");
const policyController = require("../controllers/policyController.js");
const shoppingCartController = require("../controllers/shoppingCartController.js");
const checkoutSchema = require("../schemas/checkoutSchema").checkoutSchema;
const validate = require('express-jsonschema').validate;

router.get("/policies", policyController.policies);
router.get("/dummyPolicies", policyController.dummyPolicies);
router.get("/product", policyController.getProduct);
router.use("/shoppingCarts/current/checkout", validate({body: checkoutSchema}));

/**
 * TODO:
 * PUT /shops/:clientId/shoppingCarts/:shoppingCartId/confirmation => add confirmation
 * DELETE /shops/:clientId/shoppingCarts/:shoppingCartId/confirmation => remove confirmation
 * POST /shops/:clientId/shoppingCarts/ => create new shopping cart
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
router.post("/shoppingCarts/:clientId/checkout", validate({body: checkoutSchema}), shoppingCartController.checkoutCurrentShoppingCart);

module.exports = router;
