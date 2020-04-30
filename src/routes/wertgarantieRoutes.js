const express = require('express');
const router = express.Router();
const googleController = require("../components/googlerating/googleController.js");
const selectionPopUpController = require("../components/selectionpopup/selectionPopUpController");
const shoppingCartController = require("../shoppingcart/shoppingCartController.js");
const confirmationController = require("../components/confirmation/confirmationController.js");
const purchaseController = require("../shoppingcart/checkoutController.js");
const clientController = require("../clientconfig/clientController.js");
const afterSalesController = require("../components/aftersales/afterSalesController.js");
const landingPageController = require("../components/landingpage/landingPageController");
const webservicesController = require("../backends/webservices/webservicesController");
const documentsController = require("../documents/documentsController");
const checkoutSchema = require("../shoppingcart/schemas/checkoutSchema").checkoutSchema;
const addShoppingCartProductSchema = require("../shoppingcart/schemas/addShoppingCartProductSchema").addShoppingCartProductSchema;
const afterSalesComponentCheckoutSchema = require("../components/aftersales/afterSalesComponentCheckoutSchema").afterSalesComponentCheckoutSchema;
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
router.put("/clients/:clientId/backends/webservices", basicAuth(basicAuthUsers), clientController.updateWebservicesBackendConfig);
router.delete("/clients/:clientId", basicAuth(basicAuthUsers), clientController.deleteClient);

// webservices product offers
router.post("/productOffers", basicAuth(basicAuthUsers), webservicesController.triggerProductOffersAssembly);
router.post("/productOffers/:clientId", basicAuth(basicAuthUsers), webservicesController.triggerProductOffersAssemblyForClient);
router.get("/productOffers/:clientId", basicAuth(basicAuthUsers), webservicesController.getProductOffersForClient);

// documents
router.get("/documents/:documentId", documentsController.getDocumentById);

module.exports = router;
