const signedShoppingCartSchema = require("../../shoppingcart/schemas/signedShoppingCartSchema").signedSchoppingCartSchema;

exports.selectionPopUpGetProductsSchema = {
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
        }
    }
};
