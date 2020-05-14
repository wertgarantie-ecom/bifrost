const express = require('express');
const router = express.Router();
const googleController = require("../components/googlerating/googleController");
const selectionPopUpController = require("../components/selectionpopup/selectionPopUpController");
const shoppingCartController = require("../shoppingcart/shoppingCartController");
const confirmationController = require("../components/confirmation/confirmationController");
const checkoutController = require("../shoppingcart/checkoutController");
const clientController = require("../clientconfig/clientController");
const clientComponentTextController = require("../clientconfig/clientComponentTextController");
const afterSalesController = require("../components/aftersales/afterSalesController");
const landingPageController = require("../components/landingpage/landingPageController");
const webservicesController = require("../backends/webservices/webservicesController");
const documentsController = require("../documents/documentsController");
const checkoutSchema = require("../shoppingcart/schemas/checkoutSchema").checkoutSchema;
const addShoppingCartProductSchema = require("../shoppingcart/schemas/addShoppingCartProductSchema").addShoppingCartProductSchema;
const selectionPopUpGetProductsSchema = require("../components/selectionpopup/selectionPopUpGetProductsSchema").confirmationResponseSchema;
const filterAndValidateBase64EncodedWebshopData = require("../shoppingcart/shoppingCartRequestFilter").filterAndValidateBase64EncodedWebshopData;
const validate = require('express-jsonschema').validate;
const basicAuth = require('express-basic-auth');

// components
router.get("/rating", googleController.reviewRatings);
router.put("/components/selection-popup", validate({body: selectionPopUpGetProductsSchema}), selectionPopUpController.getProducts);

router.put("/components/confirmation", confirmationController.getConfirmationComponentData);
router.put("/components/confirmation/:confirmationAttribute", confirmationController.confirmAttribute);
router.delete("/components/confirmation/product", confirmationController.removeProductFromShoppingCart);
router.delete("/components/confirmation/:confirmationAttribute", confirmationController.unconfirmAttribute);

router.get("/components/after-sales/:sessionId", afterSalesController.getAfterSalesData);
router.post("/components/after-sales/checkout", filterAndValidateBase64EncodedWebshopData, afterSalesController.componentCheckout);

router.get("/components/landing-page", landingPageController.getLandingPageData);

// shop api
router.post("/shoppingCarts/current/checkout", validate({body: checkoutSchema}), shoppingCartController.checkoutCurrentShoppingCart);

// purchases
router.get("/checkouts", checkoutController.findAllCheckouts);
router.get("/checkouts/:sessionId", checkoutController.findPurchaseById);

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

router.post("/clients/:clientId/component-texts", basicAuth(basicAuthUsers), clientComponentTextController.saveComponentTextForClient);
router.get("/clients/:clientId/component-texts", clientComponentTextController.getAllComponentTextsForClient);

// webservices product offers
router.post("/productOffers", basicAuth(basicAuthUsers), webservicesController.triggerProductOffersAssembly);
router.post("/productOffers/:clientId", basicAuth(basicAuthUsers), webservicesController.triggerProductOffersAssemblyForClient);
router.get("/productOffers/:clientId", basicAuth(basicAuthUsers), webservicesController.getProductOffersForClient);

// documents
router.get("/documents/:documentId", documentsController.getDocumentById);

module.exports = router;
