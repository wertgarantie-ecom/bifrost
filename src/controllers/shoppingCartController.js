const service = require('../services/shoppingCartService');

/**
 * Add given product to existing or new shopping cart.
 */
exports.addProductToShoppingCart = function addProductToShoppingCart(req, res) {
    const clientId = req.params.clientId;
    console.log("clientId: " + clientId);
    const shoppingCart = service.addProductToShoppingCart(req.signedCookies[clientId], {
        productId: req.body.productId,
        deviceClass: req.body.deviceClass,
        devicePrice: req.body.devicePrice,
        deviceCurrency: req.body.deviceCurrency,
    }, clientId);
    res.cookie(clientId, shoppingCart, {signed: true});
    res.send(200);
};

/**
 * Display current shopping cart.
 */
exports.showShoppingCart = function showShoppingCart(req, res) {
    res.send(req.signedCookies);
};

