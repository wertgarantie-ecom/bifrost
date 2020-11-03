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
        },
        deviceClass: {
            type: "string"
        },
        shopDeviceClass: {
            type: "string"
        },
        shopProductCondition: {
            typee: "string"
        }
    },
    required: [
        "id",
        "name",
        "price",
        "paymentInterval",
        "deviceClass",
        "shopDeviceClass"
    ]
};