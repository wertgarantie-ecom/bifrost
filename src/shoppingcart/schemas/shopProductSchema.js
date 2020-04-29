exports.shopProductSchema = {
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
};