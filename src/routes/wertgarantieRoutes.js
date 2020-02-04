const express = require('express');
const router = express.Router();
const googleController = require("../controllers/googleController.js");
const productController = require("../controllers/productController.js");
const shoppingCartController = require("../controllers/shoppingCartController.js");
const confirmationController = require("../controllers/confirmationController.js");
const purchaseController = require("../controllers/purchaseController.js");
const clientController = require("../controllers/clientController.js");
const checkoutSchema = require("../schemas/checkoutSchema").checkoutSchema;
const signedShoppingCartSchemna = require("../schemas/checkoutSchema").checkoutSchema;
const validate = require('express-jsonschema').validate;
const basicAuth = require('express-basic-auth');

// components
router.get("/rating", googleController.reviewRatings);
router.get("/components/selection-popup", productController.getProducts);

router.put("/components/confirmation", confirmationController.getConfirmationComponentData);
router.put("/components/confirmation/confirm", confirmationController.confirmShoppingCart);
router.delete("/components/confirmation/confirm", confirmationController.unconfirmShoppingCart);
router.delete("/components/confirmation/product", confirmationController.removeProductFromShoppingCart);

// shop api
router.post("/shoppingCarts/current/checkout", validate({body: checkoutSchema}), shoppingCartController.checkoutCurrentShoppingCart);

// purchases
router.get("/purchases/:sessionId", purchaseController.findPurchaseById);

// shopping cart
router.get("/shoppingCart", shoppingCartController.showShoppingCart);
router.get("/shoppingCart/:clientId", shoppingCartController.getShoppingCartForClientId);
router.post("/shoppingCart/:clientId", shoppingCartController.addProductToShoppingCart);
router.delete("/shoppingCart/:clientId", shoppingCartController.removeProductFromShoppingCart);

const user = process.env.BASIC_AUTH_USER;
const password = process.env.BASIC_AUTH_PASSWORD;
const basicAuthUsers = {
    users: {}
};
basicAuthUsers.users[user] = password;

// client settings
router.post("/clients", basicAuth(basicAuthUsers), clientController.addNewClient);
router.get("/clients", basicAuth(basicAuthUsers), clientController.getAllClients);
router.get("/clients/:clientId", basicAuth(basicAuthUsers), clientController.getClientById);
router.delete("/clients/:clientId", basicAuth(basicAuthUsers), clientController.deleteClient);

module.exports = router;
