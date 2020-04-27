module.exports.addShoppingCartProductSchema = {
    type: "object",
    properties: {
        id: {
            type: "string"
        },
        shopProduct: {
            type: "object",
            properties: {
                model: {
                    type: "string"
                },
                price: {
                    type: "integer"
                },
                deviceClass: {
                    type: "string"
                }
            },
            required: [
                "model",
                "price",
                "deviceClass"
            ]
        },
        wertgarantieProduct: {
            type: "object",
            properties: {
                id: {
                    type: "string"
                },
                name: {
                    type: "string"
                },
                paymentInterval: {
                    type: "string"
                },
                deviceClass: {
                    type: "string"
                }
            },
            required: [
                "id",
                "name",
                "paymentInterval"
            ]
        }
    },
    required: [
        "shopProduct",
        "wertgarantieProduct"
    ],
    additionalProperties: false
};
