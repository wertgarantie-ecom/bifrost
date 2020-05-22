const _service = require('./productSelectionPopUpComponentService.js');

exports.getProducts = async function getProducts(req, res, next, service = _service) {
    const deviceClass = req.body.deviceClass;
    const devicePrice = req.body.devicePrice;
    const orderItemId = req.body.orderItemId;

    try {
        const result = await service.prepareProductSelectionData(deviceClass, devicePrice, req.client, req.locale.language, orderItemId, req.shoppingCart);
        return result
            ? res.status(204).send("could not assemple exactly two product offers")
            : res.status(200).send(result);
    } catch (e) {
        next(e);
    }
};
