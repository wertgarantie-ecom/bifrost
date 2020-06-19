const service = require('./selectionEmbeddedService');
const ClientError = require('../../errors/ClientError');

exports.getProducts = async function getProducts(req, res, next) {
    const shopDeviceClasses = req.body.deviceClass ? req.body.deviceClass : req.body.deviceClasses;
    if (!shopDeviceClasses) {
        throw new ClientError("no shop device class provided!");
    }
    const devicePrice = req.body.devicePrice;

    try {
        const result = await service.getProductOffers(shopDeviceClasses, devicePrice, req.clientConfig, req.locale.language, req.shoppingCart);
        if (result.products.length > 0) {
            return res.status(200).send(result);
        }
        return res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

exports.registerProductSelected = async function registerProductSelected(req, res) {
    // const selectedProduct = req.body;
    // metrics here
    res.sendStatus(204);
};


exports.registerProductUnselected = async function registerProductUnselected(req, res) {
    // const unselectedProduct = req.body;
    // metrics here
    res.sendStatus(204);
};

