const CryptoJS = require("crypto-js");

function signObject(object, secret) {
    const stringRepresentation = JSON.stringify(object);
    return CryptoJS.HmacSHA256(stringRepresentation, secret).toString((CryptoJS.enc.Base64));
}

exports.verifyObject = function verifyObject(object, signature, secret) {
    return signature === signObject(object, secret);
};

exports.signShoppingCart = function signShoppingCart(shoppingCart, secret) {
    const signature = signObject(shoppingCart, secret);
    return JSON.stringify({
        shoppingCart: shoppingCart,
        signature: signature
    });
}

exports.signObject = signObject;