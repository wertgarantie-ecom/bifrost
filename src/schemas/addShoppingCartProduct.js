module.exports.addShoppingCartProductSchema = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
        productId: {
            type: "integer",
            required: true
        },
        devicePrice: {
            type: "integer",
            required: true
        },
        deviceClass: {
            type: "string",
            required: true
        },
        deviceCurrency: {
            type: "string",
            required: true
        },
        shopProductName: {
            type: "string",
            required: true
        }
    }
}