const wertgarantieProductSchema = require('./wertgarantieProductSchema').wertgarantieProductSchema;
const shopProductSchema = require('./shopProductSchema').shopProductSchema;

exports.orderSchema = {
    type: "object",
    properties: {
        id: {
            type: "string"
        },
        wertgarantieProduct: wertgarantieProductSchema,
        shopProduct: shopProductSchema
    },
    required: [
        "wertgarantieProduct",
        "shopProduct",
        "id"
    ]
}