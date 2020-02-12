const confirmationService = require('../services/confirmationComponentService');
const shoppingCartService = require('../services/shoppingCartService');

exports.getConfirmationComponentData = async function getConfirmationComponentData(req, res) {
    const shoppingCart = req.shoppingCart;

    const result = await confirmationService.prepareConfirmationData(shoppingCart);
    if (result) {
        res.status(200).send(result);
    } else {
        res.sendStatus(204);
    }
};

exports.removeProductFromShoppingCart = async function removeProductFromShoppingCart(req, res) {
    const updatedShoppingCart = await shoppingCartService.removeProductFromShoppingCart(req.body.orderId, req.shoppingCart);

    if (updatedShoppingCart) {
        const result = await confirmationService.prepareConfirmationData(updatedShoppingCart);
        if (result) {
            res.status(200).send(result);
        } else {
            res.sendStatus(204);
        }
    } else {
        res.sendStatus(204);
    }
};

exports.confirmShoppingCart = function confirmShoppingCart(req, res) {
    const shoppingCart = req.shoppingCart;
    if (!shoppingCart) {
        res.status(400).send("signedShoppingCart is required");
    } else {
        const confirmedShoppingCart = shoppingCartService.confirmShoppingCart(shoppingCart);
        res.status(200).send({
            message: "confirmed shopping cart",
            shoppingCart: confirmedShoppingCart
        });
    }
};

exports.unconfirmShoppingCart = function unconfirmShoppingCart(req, res) {
    const shoppingCart = req.shoppingCart;
    if (!shoppingCart) {
        res.status(400).send("signedShoppingCart is required");
    } else {
        const unconfirmedShoppingCart = shoppingCartService.unconfirmShoppingCart(req.shoppingCart);
        res.status(200).send({
            message: "unconfirmed shopping cart",
            shoppingCart: unconfirmedShoppingCart
        });
    }
};

