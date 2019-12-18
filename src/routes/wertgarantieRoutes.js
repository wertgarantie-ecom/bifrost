const express = require('express');
const router = express.Router();
const googleController = require("../controllers/googleController.js");
const productController = require("../controllers/productController.js");
const shoppingCartController = require("../controllers/shoppingCartController.js");
const confirmationController = require("../controllers/confirmationController.js");
const checkoutSchema = require("../schemas/checkoutSchema").checkoutSchema;
const validate = require('express-jsonschema').validate;

// components
router.get("/rating", googleController.reviewRatings);
router.get("/components/selection-popup", productController.getProducts);
router.get("/components/confirmation", confirmationController.getConfirmationComponentData);

// shop api
router.use("/shoppingCarts/current/checkout", validate({body: checkoutSchema}));

router.get("/shoppingCart", shoppingCartController.showShoppingCart);
router.get("/shoppingCart/:clientId", shoppingCartController.getShoppingCartForClientId);
router.post("/shoppingCart/:clientId", shoppingCartController.addProductToShoppingCart);
router.delete("/shoppingCart/:clientId", shoppingCartController.removeProductFromShoppingCart);
router.put("/shoppingCart/:clientId/confirmation", shoppingCartController.confirmShoppingCart);
router.delete("/shoppingCart/:clientId/confirmation", shoppingCartController.unconfirmShoppingCart);
router.post("/shoppingCarts/:clientId/checkout", validate({body: checkoutSchema}), shoppingCartController.checkoutCurrentShoppingCart);

module.exports = router;
