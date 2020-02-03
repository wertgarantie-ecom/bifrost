const checkoutRepository = require('../repositories/CheckoutRepository');
const signatureService = require('../services/signatureService');

exports.validateSessionId = async function validateSessionId(req, res, next, repository = checkoutRepository) {
    const cookies = req.signedCookies;

    const clientIds = Object.keys(cookies);
    await Promise.all(clientIds.map(async clientId => {
        const shoppingCart = cookies[clientId];
        const result = await repository.findBySessionId(shoppingCart.sessionId);

        if (result) {
            delete req.signedCookies[clientId];
            res.clearCookie(clientId);
        }
    }));
    next();
};

exports.validateShoppingCart = async function validateShoppingCart(req, res, next, repository = checkoutRepository) {
    if (!(req.body && req.body.shoppingCart)) {
        console.log("Empty body and/or shopping cart not available. Nothing to validate.");
        next();
    }

    const shoppingCart = req.body.shoppingCart;

    if (!signatureService.verifyShoppingCart(shoppingCart)) {
        deleteShoppingCart(req, res);
    }

    const result = await repository.findBySessionId(shoppingCart.sessionId);
    if (result) {
        deleteShoppingCart(req, res);
    }
    next();
}

function deleteShoppingCart(req, res) {
    delete req.body.shoppingCart;
    res.set('X-wertgarantie-shopping-cart-delete', true);
}
