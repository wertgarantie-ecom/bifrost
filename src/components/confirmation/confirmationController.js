const confirmationService = require('./confirmationComponentService');
const shoppingCartService = require('../../shoppingcart/shoppingCartService');

exports.getConfirmationComponentData = async function getConfirmationComponentData(req, res, next) {
    const wertgarantieShoppingCart = req.shoppingCart;
    const shopShoppingCart =  req.shopShoppingCart;
    try {
        const result = await confirmationService.prepareConfirmationData(wertgarantieShoppingCart, shopShoppingCart);
        if (result) {
            return res.status(200).send(result.instance);
        } else {
            return sendEmptyShoppingCart(res);
        }
    } catch (error) {
        return next(error)
    }
};

exports.removeProductFromShoppingCart = async function removeProductFromShoppingCart(req, res, next) {
    try {
        const updatedShoppingCart = await shoppingCartService.removeProductFromShoppingCart(req.body.orderId, req.shoppingCart);

        if (updatedShoppingCart) {
            const result = await confirmationService.prepareConfirmationData(updatedShoppingCart);
            if (result) {
                return res.status(200).send(result.instance);
            } else {
                return sendEmptyShoppingCart(res);
            }
        } else {
            return sendEmptyShoppingCart(res);
        }
    } catch (error) {
        return next(error);
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
