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
        signed: true
    });
    console.log("Set shopping cart cookie:");
    console.log(shoppingCart);
    res.status(200).send(shoppingCart);
}

/**
 * Display current shopping cart.
 */
exports.showShoppingCart = function showShoppingCart(req, res) {
    console.log("return shopping cart: ");
    console.log(req.signedCookies);
    res.send(req.signedCookies);
}

exports.getShoppingCartForClientId = function getShoppingCartForClientId(req, res) {
    const products = req.signedCookies[req.params.clientId];
    res.status(200).send(products);
}