exports.wertgarantieProductSchema = {
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
        price: {
            type: "integer"
        }
    },
    required: [
        "id",
        "name",
        "price",
        "paymentInterval"
    ]
};