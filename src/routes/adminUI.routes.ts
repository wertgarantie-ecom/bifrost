import express from 'express';
import clientBaseConfigController from '../adminUI/client/baseConfig/clientBaseConfigController';
import componentTextsController from '../adminUI/client/componentTexts/componentTextsController';


const router = express.Router();

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





export default router;