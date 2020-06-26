const signedShoppingCart = require('../../shoppingcart/schemas/signedShoppingCartSchema');

exports.removeFromShoppingCartEmbeddedSelectionSchema = {
    type: "object",
    properties: {
        wertgarantieProductId: {
            type: "string"
        },
        orderItemId: {
            type: "string"
        },
        devicePrice: {
            type: "integer"
        },
        signedShoppingCart: signedShoppingCart
    }
};