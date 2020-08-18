const signedShoppingCart = require('../../shoppingcart/schemas/signedShoppingCartSchema');

exports.removeFromShoppingCartEmbeddedSelectionSchema = {
    type: "object",
    properties: {
        orderId: {
            type: "string"
        },
        signedShoppingCart: signedShoppingCart
    }
};