const _findBySessionId = require('../repositories/CheckoutRepository').findBySessionId;
const _verifyShoppingCart = require('../services/signatureService').verifyShoppingCart;
const ClientError = require('../errors/ClientError');
const isBase64 = require('is-base64');
const SESSION_ID_HEADER = 'X-wertgarantie-session-id';

exports.detectBase64EncodedRequestBody = function detectBase64EncodedRequestBody(req, res, next) {
    const signedShoppingCart = req.body.signedShoppingCart;
    const options = {allowEmpty: false};
    if (isBase64(signedShoppingCart, options)) {
        const buffer = Buffer.from(signedShoppingCart, 'base64');
        const signedShoppingCartString = buffer.toString('utf-8');
        req.body.signedShoppingCart = JSON.parse(signedShoppingCartString);
    }
    next();
};

exports.checkSessionIdCheckout = async function checkSessionIdCheckout(req, res, next, findBySessionId = _findBySessionId) {
    const sessionId = req.get(SESSION_ID_HEADER);
    const result = await findBySessionId(sessionId);
    if (result) {
        deleteShoppingCart(req, res);
    }
    return next();
}

exports.validateShoppingCart = function validateShoppingCart(req, res, next, verifyShoppingCart = _verifyShoppingCart) {
    if (!(req.body && req.body.signedShoppingCart)) {
        console.log("Empty body and/or shopping cart not available. Nothing to validate.");
        return next();
    }

    const signedShoppingCart = req.body.signedShoppingCart;
    if (!verifyShoppingCart(signedShoppingCart)) {
        const clientError = new ClientError(`invalid signature: ${signedShoppingCart.signature}`);
        return next(clientError);
    } else {
        const shoppingCart = signedShoppingCart.shoppingCart;
        req.shoppingCart = shoppingCart;
        return next();
    }
};


function deleteShoppingCart(req, res) {
    if (req.body) {
        delete req.body.signedShoppingCart;
    }
    res.set('X-wertgarantie-shopping-cart-delete', true);
}
