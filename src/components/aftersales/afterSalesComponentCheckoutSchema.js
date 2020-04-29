const signedShoppingCartSchema = require('../../shoppingcart/schemas/signedShoppingCartSchema').requestWithSignedShoppingCartSchema;
const checkoutSchema = require('../../shoppingcart/schemas/checkoutSchema').checkoutSchema;

module.exports.afterSalesComponentCheckoutSchema = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
        webshopData: {
            type: "object",
            properties: {
                purchasedProducts: checkoutSchema.properties.purchasedProducts,
                customer: checkoutSchema.properties.customer,
                encryptedSessionId: {
                    type: "string"
                },
                required: [
                    "purchasedProducts",
                    "customer",
                    "encryptedSessionId"
                ]
            }
        },
        signedShoppingCart: signedShoppingCartSchema.properties.signedShoppingCart
    },
    required: [
        "webshopData",
        "signedShoppingCart"
    ]
};
