const express = require('express');
const router = express.Router();
const googleController = require("../controllers/googleController.js");
const selectionPopUpController = require("../controllers/selectionPopUpController");
const shoppingCartController = require("../controllers/shoppingCartController.js");
const confirmationController = require("../controllers/confirmationController.js");
const purchaseController = require("../controllers/purchaseController.js");
const clientController = require("../controllers/clientController.js");
const afterSalesController = require("../controllers/afterSalesController.js");
const landingPageController = require("../controllers/landingPageController");
const checkoutSchema = require("../schemas/checkoutSchema").checkoutSchema;
const addShoppingCartProductSchema = require("../schemas/addShoppingCartProduct").addShoppingCartProductSchema;
const afterSalesComponentCheckoutSchema = require("../schemas/afterSalesComponentCheckoutSchema").afterSalesComponentCheckoutSchema;
const validate = require('express-jsonschema').validate;
const basicAuth = require('express-basic-auth');

// components
router.get("/rating", googleController.reviewRatings);
router.get("/components/selection-popup", selectionPopUpController.getProducts);

router.put("/components/confirmation", confirmationController.getConfirmationComponentData);
router.put("/components/confirmation/:confirmationAttribute", confirmationController.confirmAttribute);
router.delete("/components/confirmation/product", confirmationController.removeProductFromShoppingCart);
router.delete("/components/confirmation/:confirmationAttribute", confirmationController.unconfirmAttribute);

router.get("/components/after-sales/:sessionId", afterSalesController.getAfterSalesData);
router.post("/components/after-sales/checkout", validate({body: afterSalesComponentCheckoutSchema}), afterSalesController.componentCheckout);

router.get("/components/landing-page", landingPageController.getLandingPageData);

// shop api
router.post("/shoppingCarts/current/checkout", validate({body: checkoutSchema}), shoppingCartController.checkoutCurrentShoppingCart);

// purchases
router.get("/purchases/:sessionId", purchaseController.findPurchaseById);

// shopping cart
router.post("/shoppingCart/:clientId", validate({body: addShoppingCartProductSchema}), shoppingCartController.addProductToShoppingCart);

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
