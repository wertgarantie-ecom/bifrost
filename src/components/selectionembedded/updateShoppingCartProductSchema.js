const wertgarantieProductSchema = require('../../shoppingcart/schemas/wertgarantieProductSchema').wertgarantieProductSchema;
const signedShoppingCartSchema = require('../../shoppingcart/schemas/signedShoppingCartSchema').signedSchoppingCartSchema;

exports.updateShoppingCartProductSchema = {
    type: "object",
    required: [
        "orderId",
        "shopProduct",
        "wertgarantieProduct",
        "signedShoppingCart"
    ],
    additionalProperties: false,
    properties: {
        orderId: {
            type: "string"
        },
        shopProduct: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                },
                price: {
                    type: "integer"
                },
                deviceClass: {
                    type: "string"
                },
                deviceClasses: {
                    type: "string"
                },
                orderItemId: {
                    type: "string"
                }
            },
            required: [
                "name",
                "price",
                "orderItemId"
            ]
        },
        wertgarantieProduct: wertgarantieProductSchema,
        signedShoppingCart: signedShoppingCartSchema
    }
};