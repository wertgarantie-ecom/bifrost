const _service = require('./productSelectionPopUpComponentService.js');

exports.getProducts = async function getProducts(req, res, next, service = _service) {
    const deviceClass = req.body.deviceClass;
    const devicePrice = req.body.devicePrice;
    const clientId = req.body.clientId;
    const orderItemId = req.body.orderItemId;

    try {
        const validatorResult = await service.prepareProductSelectionData(deviceClass, devicePrice, clientId, req.locale.language, orderItemId, req.shoppingCart);
        if (validatorResult === undefined) {
            return res.status(204).send("product is not applicable for cross selling");
        }
        if (!validatorResult.valid) {
            return res.status(502).send(validatorResult.errors);
        } else {
            if (validatorResult.instance.products.length !== 2) {
                return res.status(204).send("could not assemble two product offers");
            }
            return res.status(200).send(validatorResult.instance);
        }
    } catch (e) {
        next(e);
    }
};
