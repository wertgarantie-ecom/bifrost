const wertgarantieProductSchema = require('./wertgarantieProductSchema').wertgarantieProductSchema;
const signedShoppingCartSchema = require('./signedShoppingCartSchema').signedSchoppingCartSchema;

exports.addShoppingCartProductSchema = {
    type: "object",
    required: [
        "shopProduct",
        "wertgarantieProduct"
    ],
    additionalProperties: false,
    properties: {
        shopProduct: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                },
                price: {
                    type: "integer"
                },
                deviceClasses: {
                    type: "string"
                },
                orderItemId: {
                    type: "string"
                },
                deviceCondition: {
                    type: "string"
                }
            },
            required: [
                "name",
                "price"
            ]
        },
        wertgarantieProduct: wertgarantieProductSchema,
        signedShoppingCart: signedShoppingCartSchema
    }
};