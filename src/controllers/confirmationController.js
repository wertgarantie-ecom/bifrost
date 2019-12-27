const confirmationService = require('../services/confirmationComponentService');
const shoppingCartService = require('../services/shoppingCartService');

exports.getConfirmationComponentData = async function getConfirmationComponentData(req, res) {
    const clientId = req.query.clientId;
    const shoppingCart = req.signedCookies[clientId];

    const result = await confirmationService.prepareConfirmationData(clientId, shoppingCart);

    res.status(200).send(result);
}

exports.removeProductFromShoppingCart = async function removeProductFromShoppingCart(req, res) {
    const clientId = req.body.clientId;
    const shoppingCart = await shoppingCartService.removeProductFromShoppingCart(req.body.orderId, req.signedCookies[clientId]);

    if (shoppingCart.products.length === 0) {
        res.clearCookie(clientId);
    } else {
        res.cookie(clientId, shoppingCart, {
            signed: true
        });
    }
    const response = await confirmationService.prepareConfirmationData(clientId, shoppingCart);
    res.status(200).send(response);
}

exports.confirmShoppingCart = function confirmShoppingCart(req, res) {
    const clientId = req.body.clientId;
    const shoppingCart = req.signedCookies[clientId];
    const confirmedShoppingCart = shoppingCartService.confirmShoppingCart(shoppingCart, clientId);
    sendShoppingCart(res, confirmedShoppingCart);
};

exports.unconfirmShoppingCart = function unconfirmShoppingCart(req, res) {
    const clientId = req.body.clientId;
    const shoppingCart = req.signedCookies[clientId];
    const unconfirmedShoppingCart = shoppingCartService.unconfirmShoppingCart(shoppingCart, clientId);
    sendShoppingCart(res, unconfirmedShoppingCart);
};

function sendShoppingCart(res, shoppingCart) {
    res.cookie(shoppingCart.clientId, shoppingCart, {
        signed: true
    });
    res.status(200).send(shoppingCart);
}