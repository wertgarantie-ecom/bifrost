const checkoutRepository = require('../repositories/CheckoutRepository');
const signatureService = require('../services/signatureService');

exports.validateShoppingCart = async function validateShoppingCart(req, res, next, repository = checkoutRepository) {
    if (!(req.body && req.body.signedShoppingCart)) {
        console.log("Empty body and/or shopping cart not available. Nothing to validate.");
        return next();
    }

    const signedShoppingCart = req.body.signedShoppingCart;
    if (!signatureService.verifyShoppingCart(signedShoppingCart)) {
        deleteShoppingCart(req, res);
        return next();
    } else {
        const shoppingCart = signedShoppingCart.shoppingCart;
        const result = await repository.findBySessionId(shoppingCart.sessionId);
        if (result) {
            deleteShoppingCart(req, res);
        }
        req.shoppingCart = shoppingCart.shoppingCart;
        return next();
    }
};

function deleteShoppingCart(req, res) {
    delete req.body.signedShoppingCart;
    res.set('X-wertgarantie-shopping-cart-delete', true);
}
