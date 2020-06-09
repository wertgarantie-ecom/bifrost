exports.productSelectionClickedSchema = {
    type: "object",
    properties: {
        productId: {
            type: "string"
        },
        productName: {
            type: "string"
        }
    },
    required: [
        "productId",
        "productName"
    ]
}