const shopProductSchema = require('./shopProductSchema').shopProductSchema;
const wertgarantieProductSchema = require('./wertgarantieProductSchema').wertgarantieProductSchema;
const signedShoppingCartSchema = require('./signedShoppingCartSchema').requestWithSignedShoppingCartSchema.properties.signedShoppingCart;

exports.addShoppingCartProductSchema = {
    type: "object",
    required: [
        "shopProduct",
        "wertgarantieProduct"
    ],
    additionalProperties: false,
    properties: {
        shopProduct: shopProductSchema,
        wertgarantieProduct: wertgarantieProductSchema,
        signedShoppingCart: signedShoppingCartSchema
    }
};