const checkoutRepository = require('../repositories/CheckoutRepository');

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