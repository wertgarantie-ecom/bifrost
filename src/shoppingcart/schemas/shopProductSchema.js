exports.shopProductSchema = {
    type: "object",
    properties: {
        name: {
            type: "string"
        },
        price: {
            type: "integer"
        },
        deviceClass: {
            type: "string"
        },
        orderItemId: {
            type: "string"
        }
    },
    required: [
        "name",
        "price",
        "deviceClass"
    ]
};