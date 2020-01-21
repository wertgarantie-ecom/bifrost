const service = require('../services/shoppingCartService');

/**
 * Add given product to existing or new shopping cart.
 */
exports.addProductToShoppingCart = function addProductToShoppingCart(req, res) {
    const clientId = req.params.clientId;
    const cartData = {
        wertgarantieProductId: parseInt(req.body.productId),
        deviceClass: req.body.deviceClass,
        devicePrice: parseInt(req.body.devicePrice),
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

exports.checkoutCurrentShoppingCart = async function checkoutCurrentShoppingCart(req, res, next) {
    if (!req.body.wertgarantieShoppingCart || req.body.wertgarantieShoppingCart === "") {
        res.status(200).send({
            message: `No Wertgarantie products were provided for checkout call. In this case, the API call to Wertgarantie-Bifrost is not needed.` 
        });
    } else {
        try {
            const result = await service.checkoutShoppingCart(req.body.purchasedProducts, req.body.customer, JSON.parse(req.body.wertgarantieShoppingCart), req.body.secretClientId);
            res.status(200).send(result);
        } catch (error) {
            if (error instanceof SyntaxError) { //JSON.parse fails
                res.status(400).send({
                    error: error,
                    message: "Corrupt JSON provided as wertgarantie shopping cart. Checkout call will not be processed."
                })
            } else {
                next(error);
            }
        }
    }
};
