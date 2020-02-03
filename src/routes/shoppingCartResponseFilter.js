const signatureService = require('../services/signatureService');

exports.signShoppingCart = async function signShoppingCart(req, res, next) {
    if (!(req.res && req.res.shoppingCart)) {
        return next();
    }

    res.signedShoppingCart = signatureService.signShoppingCart(res.shoppingCart);
    delete res.shoppingCart;
    return next();
};
