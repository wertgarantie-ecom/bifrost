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
    res.status(200).send(shoppingCart);
}

/**
 * Display current shopping cart.
 */
exports.showShoppingCart = function showShoppingCart(req, res) {
    res.send(req.signedCookies);
}

exports.getShoppingCartForClientId = function getShoppingCartForClientId(req, res) {
    const products = req.signedCookies[req.params.clientId];
    res.status(200).send(products);
}

exports.removeProductFromShoppingCart = function removeProductFromShoppingCart(req, res) {
    var shoppingCart = req.signedCookies[req.params.clientId];
    var products = shoppingCart.products;
    var orderToBeDeleted = req.body.orderId;
    for( var i = 0; i < products.length; i++){ 
        if ( products[i].orderId == orderToBeDeleted) {
            products.splice(i, 1); 
          i--;
        }
    }

    if (products.length === 0) {
        res.clearCookie(req.params.clientId);
    } else {
        res.cookie(req.params.clientId, shoppingCart, {
            signed: true
        });
    }

    res.status(200).send(shoppingCart);
}