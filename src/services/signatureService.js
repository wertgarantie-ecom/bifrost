const CryptoJS = require("crypto-js");
const _clientService = require('./clientService');
const SIGN_SECRET = process.env.SIGN_SECRET;

function signObject(object, secret = SIGN_SECRET) {
    const stringRepresentation = JSON.stringify(object);
    return signString(stringRepresentation, secret);
}

function signString(string, secret = SIGN_SECRET) {
    // return CryptoJS.HmacSHA256(string, secret).toString((CryptoJS.enc.Base64));
    return CryptoJS.HmacSHA256(string, secret).toString();
}

function verifyString(encryptedString, string, secret) {
    return signString(string, secret) === encryptedString;
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
};

exports.verifyShoppingCart = function verifyShoppingCart(signedShoppingCart, secret = SIGN_SECRET) {
    return verifyObject(signedShoppingCart.shoppingCart, signedShoppingCart.signature, secret);
};

exports.verifySessionId = async function verifySessionId(encryptedSessionId, publicClientId, sessionId, clientService = _clientService) {
    const clientConfig = await clientService.findClientForPublicClientId(publicClientId);
    if (clientConfig) {
        const result = false;
        return clientConfig.secrets.reduce((isValid, secret) => isValid || verifyString(encryptedSessionId, sessionId, secret), false);
    } else {
        return false;
    }
};

exports.signObject = signObject;
exports.verifyObject = verifyObject;
exports.signString = signString;
exports.verifyString = verifyString;