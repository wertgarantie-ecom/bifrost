const confirmationService = require('../services/confirmationComponentService');
const shoppingCartService = require('../services/shoppingCartService');

exports.getConfirmationComponentData = async function getConfirmationComponentData(req, res) {
    const shoppingCart = req.shoppingCart;

    const result = await confirmationService.prepareConfirmationData(shoppingCart);
    if (result) {
        res.status(200).send(result);
    } else {
        sendEmptyShoppingCart(res);
    }
};

exports.removeProductFromShoppingCart = async function removeProductFromShoppingCart(req, res) {
    const updatedShoppingCart = await shoppingCartService.removeProductFromShoppingCart(req.body.orderId, req.shoppingCart);

    if (updatedShoppingCart) {
        const result = await confirmationService.prepareConfirmationData(updatedShoppingCart);
        if (result) {
            res.status(200).send(result);
        } else {
            sendEmptyShoppingCart(res);
        }
    } else {
        sendEmptyShoppingCart(res);
    }
};

exports.confirmAttribute = function confirmAttribute(req, res) {
    const shoppingCart = req.shoppingCart;
    const confirmationAttribute = req.params.confirmationAttribute;
    if (!shoppingCart) {
        res.status(400).send("signedShoppingCart is required");
    } else {
        const confirmedShoppingCart = shoppingCartService.confirmAttribute(shoppingCart, confirmationAttribute);
        res.status(200).send({
            message: "confirmed shopping cart",
            shoppingCart: confirmedShoppingCart
        });
    }
};

exports.unconfirmAttribute = function unconfirmAttribute(req, res) {
    const shoppingCart = req.shoppingCart;
    const confirmationAttribute = req.params.confirmationAttribute;
    if (!shoppingCart) {
        res.status(400).send("signedShoppingCart is required");
    } else {
        const unconfirmedShoppingCart = shoppingCartService.unconfirmAttribute(shoppingCart, confirmationAttribute);
        res.status(200).send({
            message: "unconfirmed shopping cart",
            shoppingCart: unconfirmedShoppingCart
        });
    }
};

function sendEmptyShoppingCart(res) {
    res.set('X-wertgarantie-shopping-cart-delete', true);
    res.sendStatus(204);
}
