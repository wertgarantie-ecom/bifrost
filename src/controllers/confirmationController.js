const confirmationService = require('../services/confirmationComponentService');
const shoppingCartService = require('../services/shoppingCartService');

exports.getConfirmationComponentData = async function getConfirmationComponentData(req, res) {
    const clientId = req.query.clientId;
    const shoppingCart = req.signedCookies[clientId] || req.shoppingCart;

    const result = await confirmationService.prepareConfirmationData(clientId, shoppingCart);
    if (result) {
        res.status(200).send(result);
    } else {
        return res.sendStatus(204);
    }
};

exports.removeProductFromShoppingCart = async function removeProductFromShoppingCart(req, res) {
    const clientId = req.body.clientId;
    const shoppingCart = await shoppingCartService.removeProductFromShoppingCart(req.body.orderId, req.signedCookies[clientId]);

    if (shoppingCart) {
        const response = await confirmationService.prepareConfirmationData(clientId, shoppingCart);
        res.status(200).send(response);
    }
    res.status(204);
};

exports.confirmShoppingCart = function confirmShoppingCart(req, res) {
    const confirmedShoppingCart = shoppingCartService.confirmShoppingCart(req.shoppingCart);
    res.send(200, confirmedShoppingCart);
};

exports.unconfirmShoppingCart = function unconfirmShoppingCart(req, res) {
    const unconfirmedShoppingCart = shoppingCartService.unconfirmShoppingCart(req.shoppingCart);
    res.send(200, confirmedShoppingCart);
};

