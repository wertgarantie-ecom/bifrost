const express = require('express');
const router = express.Router();
const googleController = require("../controllers/googleController.js");
const productController = require("../controllers/productController.js");
const shoppingCartController = require("../controllers/shoppingCartController.js");
const confirmationController = require("../controllers/confirmationController.js");
const purchaseController = require("../controllers/purchaseController.js");
const checkoutSchema = require("../schemas/checkoutSchema").checkoutSchema;
const validate = require('express-jsonschema').validate;

// components
router.get("/rating", googleController.reviewRatings);
router.get("/components/selection-popup", productController.getProducts);
router.get("/components/confirmation", confirmationController.getConfirmationComponentData);
router.put("/components/confirmation", confirmationController.confirmShoppingCart);
router.delete("/components/confirmation", confirmationController.unconfirmShoppingCart);
router.delete("/components/confirmation/product", confirmationController.removeProductFromShoppingCart);

// shop api
router.post("/shoppingCarts/current/checkout", validate({body: checkoutSchema}), shoppingCartController.checkoutCurrentShoppingCart);

// purchases
router.get("/purchases/:sessionId", purchaseController.findPurchaseById);

router.get("/shoppingCart", shoppingCartController.showShoppingCart);
router.get("/shoppingCart/:clientId", shoppingCartController.getShoppingCartForClientId);
router.post("/shoppingCart/:clientId", shoppingCartController.addProductToShoppingCart);
router.delete("/shoppingCart/:clientId", shoppingCartController.removeProductFromShoppingCart);

module.exports = router;
