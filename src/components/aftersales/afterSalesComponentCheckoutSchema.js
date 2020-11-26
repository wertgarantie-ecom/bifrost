const checkoutSchema = require('../../shoppingcart/schemas/checkoutSchema').checkoutSchema;

module.exports.afterSalesComponentCheckoutSchema = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
        orderId: {
            type: "string"
        },
        purchasedProducts: checkoutSchema.properties.purchasedProducts,
        customer: checkoutSchema.properties.customer,
        encryptedSessionId: {
            type: "string"
        },
    },
    required: [
        "purchasedProducts",
        "customer",
        "encryptedSessionId"
    ]
};
