const signedShoppingCartSchema = require("../../shoppingcart/schemas/signedShoppingCartSchema").signedSchoppingCartSchema;

exports.confirmationResponseSchema = {
    type: "object",
    required: [
        "deviceClass",
        "devicePrice"
    ],
    properties: {
        signedShoppingCart: signedShoppingCartSchema,
        deviceClass: {
            type: "string"
        },
        devicePrice: {
            type: "integer"
        },
        orderItemId: {
            type: "string"
        },
    }
};
