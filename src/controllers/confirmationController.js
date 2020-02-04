const confirmationService = require('../services/confirmationComponentService');
const shoppingCartService = require('../services/shoppingCartService');

exports.getConfirmationComponentData = async function getConfirmationComponentData(req, res) {
    const shoppingCart = req.shoppingCart;

    const result = await confirmationService.prepareConfirmationData(shoppingCart);
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
    const shoppingCart = req.shoppingCart;
    if (!shoppingCart) {
        res.send(400, "signedShoppingCart is required")
    } else {
        const confirmedShoppingCart = shoppingCartService.confirmShoppingCart(shoppingCart);
        res.send(200, confirmedShoppingCart);
    }
};

exports.unconfirmShoppingCart = function unconfirmShoppingCart(req, res) {
    const shoppingCart = req.shoppingCart;
    if (!shoppingCart) {
        res.send(400, "signedShoppingCart is required")
    } else {
        const unconfirmedShoppingCart = shoppingCartService.unconfirmShoppingCart(req.shoppingCart);
        res.send(200, unconfirmedShoppingCart);
    }
};

