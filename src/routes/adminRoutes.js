const express = require('express');
const router = express.Router();
const checkoutController = require("../shoppingcart/checkoutController");
const clientController = require("../clientconfig/clientController");
const clientComponentTextController = require("../clientconfig/clientComponentTextController");
const webservicesController = require("../backends/webservices/webservicesController");
const documentsController = require("../documents/documentsController");
const handbookController = require("../handbook/handbookController");
const basicAuth = require('express-basic-auth');
const basicAuthByClientId = require('./basicAuthByClientIdFilter');
// purchases
router.get("/checkouts", checkoutController.findAllCheckouts);
router.get("/checkouts/:sessionId", checkoutController.findPurchaseById);


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

// client installation guide
router.get("/clients/:clientId/documentation", basicAuthByClientId, (req, res) => res.redirect(`../${req.params.clientId}/handbook`));
router.get("/clients/:clientId/handbook", basicAuthByClientId, handbookController.getClientHandbook);

// webservices product offers
router.post("/productOffers", basicAuth(basicAuthUsers), webservicesController.triggerProductOffersAssembly);
router.post("/productOffers/:clientId", basicAuth(basicAuthUsers), webservicesController.triggerProductOffersAssemblyForClient);
router.get("/productOffers/:clientId", basicAuth(basicAuthUsers), webservicesController.getProductOffersForClient);

// documents
router.get("/documents/:documentId", documentsController.getDocumentById);

module.exports = router;
