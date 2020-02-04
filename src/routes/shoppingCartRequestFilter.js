const {_findBySessionId} = require('../repositories/CheckoutRepository');
const {_verifyShoppingCart} = require('../services/signatureService');
const ClientError = require('../errors/ClientError');

exports.validateShoppingCart = async function validateShoppingCart(req, res, next, {findBySessionId = _findBySessionId, verifyShoppingCart = _verifyShoppingCart}) {
    if (!(req.body && req.body.signedShoppingCart)) {
        console.log("Empty body and/or shopping cart not available. Nothing to validate.");
        return next();
    }

    const signedShoppingCart = req.body.signedShoppingCart;
    if (!verifyShoppingCart(signedShoppingCart)) {
        throw new ClientError(`invalid signature: ${signedShoppingCart.signature}`);
    } else {
        const shoppingCart = signedShoppingCart.shoppingCart;
        const result = await findBySessionId(shoppingCart.sessionId);
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
