exports.shopProductSchema = {
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
};