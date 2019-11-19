const service = require('../services/shoppingCartService');

/**
 * Add given product to existing or new shopping cart.
 */
exports.addProductToShoppingCart = function addProductToShoppingCart(req, res) {
    const clientId = req.params.clientId;
    console.log("clientId: " + clientId);
    const cartData = {
        productId: req.body.productId,
        deviceClass: req.body.deviceClass,
        devicePrice: req.body.devicePrice,
        deviceCurrency: req.body.deviceCurrency
    }
    const shoppingCart = service.addProductToShoppingCart(req.signedCookies[clientId], cartData, clientId);
    res.cookie(clientId, shoppingCart, {signed: true});
    res.status(200).send(shoppingCart);
};

/**
 * Display current shopping cart.
 */
exports.showShoppingCart = function showShoppingCart(req, res) {
    const signedCookie = req.signedCookies;
    console.log(req.headers)
    console.log(signedCookie);
    res.send(signedCookie);
};

