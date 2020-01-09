const service = require('../services/shoppingCartService');

/**
 * Add given product to existing or new shopping cart.
 */
exports.addProductToShoppingCart = function addProductToShoppingCart(req, res) {
    const clientId = req.params.clientId;
    const cartData = {
        wertgarantieProductId: parseInt(req.body.productId),
        deviceClass: req.body.deviceClass,
        devicePrice: req.body.devicePrice,
        deviceCurrency: req.body.deviceCurrency,
        shopProductName: req.body.shopProductName
    };
    const shoppingCart = service.addProductToShoppingCart(req.signedCookies[clientId], cartData, clientId);

    res.cookie(shoppingCart.clientId, shoppingCart, {
        signed: true
    });
    res.status(200).send(shoppingCart);
};

/**
 * Display current shopping cart.
 */
exports.showShoppingCart = function showShoppingCart(req, res) {
    res.send(req.signedCookies);
};

exports.showShoppingCart = function showShoppingCart(req, res) {
    res.send(req.signedCookies);
};

exports.getShoppingCartForClientId = function getShoppingCartForClientId(req, res) {
    const products = req.signedCookies[req.params.clientId] || {};
    res.status(200).send(products);
};

exports.removeProductFromShoppingCart = function removeProductFromShoppingCart(req, res) {

    const shoppingCart = service.removeProductFromShoppingCart(req.params.orderId, req.signedCookies[req.params.clientId]);

    if (shoppingCart.products.length === 0) {
        res.clearCookie(req.params.clientId);
    } else {
        res.cookie(req.params.clientId, shoppingCart, {
            signed: true
        });
    }

    res.status(200).send(shoppingCart);
};

exports.checkoutCurrentShoppingCart = async function checkoutCurrentShoppingCart(req, res) {
    const result = await service.checkoutShoppingCart(req.body.purchasedProducts, req.body.customer, JSON.parse(req.body.wertgarantieShoppingCart), req.body.secretClientId);

    res.status(200).send(result);
};
