const _service = require('./productSelectionPopUpComponentService.js');
const metrics = require('../../framework/metrics');
const selectionpopup = require('../components').components.selectionpopup.name;
const ClientError = require('../../errors/ClientError');

exports.getProducts = async function getProducts(req, res, next, service = _service) {
    const shopDeviceClasses = req.body.deviceClass ? req.body.deviceClass : req.body.deviceClasses;
    if (!shopDeviceClasses) {
        throw new ClientError("no shop device class provided!");
    }
    const devicePrice = req.body.devicePrice;
    const orderItemId = req.body.orderItemId;
    const offeredOrderItemIds = req.body.offeredOrderItemIds;

    try {
        const result = await service.showSelectionPopUpComponent(shopDeviceClasses, devicePrice, req.clientConfig, req.locale.language, orderItemId, req.shoppingCart, offeredOrderItemIds);
        return result
            ? res.status(200).send(result)
            : res.status(204).send("could not assemple exactly two product offers");
    } catch (e) {
        next(e);
    }
};

exports.popUpCanceled = async function popUpCanceled(req, res) {
    const clientConfig = req.clientConfig;
    metrics().incrementComponentRequest(selectionpopup, "cancel", "canceled", clientConfig.name);
    return res.sendStatus(204);
};