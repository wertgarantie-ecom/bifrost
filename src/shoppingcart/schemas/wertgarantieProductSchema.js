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
        }
    },
    required: [
        "id",
        "name",
        "paymentInterval"
    ]
};