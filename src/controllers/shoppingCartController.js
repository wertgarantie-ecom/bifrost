const service = require('../services/shoppingCartService');

/**
 * Add given product to existing or new shopping cart.
 */
exports.addProductToShoppingCart = function addProductToShoppingCart(req, res) {
    const clientId = req.params.clientId;
    const cartData = {
        productId: req.body.productId,
        deviceClass: req.body.deviceClass,
        devicePrice: req.body.devicePrice,
        deviceCurrency: req.body.deviceCurrency,
        shopProductName: req.body.shopProductName
    }
    const shoppingCart = service.addProductToShoppingCart(req.signedCookies[clientId], cartData, clientId);
    res.cookie(clientId, shoppingCart, {
        signed: true,
    });
    res.status(200).send(shoppingCart);
};

/**
 * Display current shopping cart.
 */
exports.showShoppingCart = function showShoppingCart(req, res) {
    res.send(req.signedCookies);
};

