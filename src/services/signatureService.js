const CryptoJS = require("crypto-js");

function signObject(object, key) {
    const stringRepresentation = JSON.stringify(object);
    return CryptoJS.HmacSHA256(stringRepresentation, key).toString((CryptoJS.enc.Base64));
}

exports.verifyObject = function verifyObject(message, signature, key) {
    return signature === signObject(message, key);
};

exports.signObject = signObject;