const CryptoJS = require("crypto-js");
const SIGN_SECRET = process.env.SIGN_SECRET;

function signObject(object, secret = SIGN_SECRET) {
    const stringRepresentation = JSON.stringify(object);
    return CryptoJS.HmacSHA256(stringRepresentation, secret).toString((CryptoJS.enc.Base64));
}

function verifyObject(object, signature, secret = SIGN_SECRET) {
    return signature === signObject(object, secret);
}

exports.signShoppingCart = function signShoppingCart(shoppingCart, secret = SIGN_SECRET) {
    const signature = signObject(shoppingCart, secret);
    return {
        shoppingCart: shoppingCart,
        signature: signature
    };
}

exports.verifyShoppingCart = function verifyShoppingCart(signedShoppingCart, secret = SIGN_SECRET) {
    return verifyObject(signedShoppingCart.shoppingCart, signedShoppingCart.signature, secret);
}

exports.signObject = signObject;
exports.verifyObject = verifyObject;