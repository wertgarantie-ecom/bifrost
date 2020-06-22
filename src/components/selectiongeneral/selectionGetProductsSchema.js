const signedShoppingCartSchema = require("../../shoppingcart/schemas/signedShoppingCartSchema").signedSchoppingCartSchema;

exports.selectionPopUpGetProductsSchema = {
    type: "object",
    required: [
        "devicePrice"
    ],
    properties: {
        signedShoppingCart: signedShoppingCartSchema,
        deviceClasses: {
            type: "string"
        },
        deviceClass: {
            type: "string"
        },
        devicePrice: {
            type: "integer"
        },
        orderItemId: {
            type: "string"
        },
        offeredOrderItemIds: {
            type: "array",
            items: {
                type: "string"
            }
        }
    }
};
