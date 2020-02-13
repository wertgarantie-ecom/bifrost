const _findBySessionId = require('../repositories/CheckoutRepository').findBySessionId;
const _verifyShoppingCart = require('../services/signatureService').verifyShoppingCart;
const ClientError = require('../errors/ClientError');
const isBase64 = require('is-base64');

exports.detectBase64EncodedRequestBody = function detectBase64EncodedRequestBody(req, res, next) {
    const signedShoppingCart = req.body.signedShoppingCart;
    if (isBase64(signedShoppingCart)) {
        const buffer = Buffer.from(signedShoppingCart, 'base64');
        const signedShoppingCartString = buffer.toString('utf-8');
        req.body.signedShoppingCart = JSON.parse(signedShoppingCartString);
    }
    next();
};

exports.validateShoppingCart = async function validateShoppingCart(req, res, next, findBySessionId = _findBySessionId, verifyShoppingCart = _verifyShoppingCart) {
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
            return next();
        } else {
            req.shoppingCart = shoppingCart;
            return next();
        }
    }
};

function deleteShoppingCart(req, res) {
    delete req.body.signedShoppingCart;
    res.set('X-wertgarantie-shopping-cart-delete', true);
}
