const signedShoppingCartSchema = require("../../shoppingcart/schemas/signedShoppingCartSchema").signedSchoppingCartSchema;

exports.confirmationResponseSchema = {
    type: "object",
    required: [
        "deviceClass",
        "devicePrice",
        "clientId",
    ],
    properties: {
        signedShoppingCart: signedShoppingCartSchema,
        deviceClass: {
            type: "string"
        },
        devicePrice: {
            type: "integer"
        },
        clientId: {
            type: "string"
        },
        orderItemId: {
            type: "string"
        },
    }
};
