const signatureService = require('./signatureService');
const mung = require('express-mung');

function signShoppingCart(body, req, res) {
    if (body.shoppingCart) {
        body.signedShoppingCart = signatureService.signShoppingCart(body.shoppingCart);
        delete body.shoppingCart;
    }
    return body;
}

module.exports = mung.json(signShoppingCart);
