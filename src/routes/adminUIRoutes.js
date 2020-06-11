const express = require('express');
const router = express.Router();
const clientBaseConfigController = require('../adminUI/client/clientBaseConfigController');
const componentTextsController = require('../adminUI/client/componentTexts/componentTextsController');
const clientBackendConfigurationController = require('../adminUI/client/clientBackendConfigurationController');


router.get("/", clientBaseConfigController.showAllClients);
router.get("/:clientId", clientBaseConfigController.showClient);
router.get("/:clientId/base", clientBaseConfigController.showClient);
router.get("/:clientId/component-texts", componentTextsController.showComponentTexts);
router.post("/:clientId/component-texts", componentTextsController.saveComponentText);
router.post("/:clientId/component-texts/delete", componentTextsController.deleteComponentText);
router.post("/:clientId/component-texts/new-attribute", componentTextsController.saveNewTextAttribute);
router.get("/:clientId/backend-config", clientBackendConfigurationController.showBackendConfig);
router.post("/:clientId/backend-config", clientBackendConfigurationController.saveBackendConfig);

module.exports = router;