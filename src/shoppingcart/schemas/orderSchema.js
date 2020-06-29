const wertgarantieProductSchema = require('./wertgarantieProductSchema').wertgarantieProductSchema;

exports.orderSchema = {
    type: "object",
    properties: {
        id: {
            type: "string"
        },
        wertgarantieProduct: wertgarantieProductSchema,
        shopProduct: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                },
                price: {
                    type: "integer"
                },
                deviceClasses: {
                    type: "string"
                },
                orderItemId: {
                    type: "string"
                }
            },
            required: [
                "name",
                "price",
                "deviceClasses"
            ]
        }
    },
    required: [
        "wertgarantieProduct",
        "shopProduct",
        "id"
    ]
};