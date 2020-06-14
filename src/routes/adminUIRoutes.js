const express = require('express');
const router = express.Router();
const clientBaseConfigController = require('../adminUI/client/baseConfig/clientBaseConfigController');
const componentTextsController = require('../adminUI/client/componentTexts/componentTextsController');


router.get("/", clientBaseConfigController.showAllClients);
router.post("/", clientBaseConfigController.addNewClient);
router.post("/delete", clientBaseConfigController.deleteClient);
router.get("/:clientId", clientBaseConfigController.showClient);
router.get("/:clientId/base", clientBaseConfigController.showClient);
router.post("/:clientId/base", clientBaseConfigController.saveBaseClientConfig);
router.get("/:clientId/component-texts", componentTextsController.showComponentTexts);
router.post("/:clientId/component-texts", componentTextsController.saveComponentText);
router.post("/:clientId/component-texts/delete", componentTextsController.deleteComponentText);
router.post("/:clientId/component-texts/new-attribute", componentTextsController.saveNewTextAttribute);

module.exports = router;