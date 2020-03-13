const signedShoppingCartSchema = require('./signedShoppingCartSchema').requestWithSignedShoppingCartSchema;
const checkoutSchema = require('./checkoutSchema').checkoutSchema;

module.exports.afterSalesComponentCheckoutSchema = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
        purchasedProducts: checkoutSchema.properties.purchasedProducts,
        customer: checkoutSchema.properties.customer,
        encryptedSessionId: {
            type: "string"
        },
        signedShoppingCart: signedShoppingCartSchema.properties.signedShoppingCart
    },
    required: [
        "purchasedProducts",
        "customer",
        "encryptedSessionId",
        "signedShoppingCart"
    ]
};
