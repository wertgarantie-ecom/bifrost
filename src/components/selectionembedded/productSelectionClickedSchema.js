exports.productSelectionClickedSchema = {
    type: "object",
    properties: {
        productId: {
            type: "string"
        },
        productName: {
            type: "string"
        },
        productIndex: {
            type: "integer"
        },
        productBaseIdentifier: {
            type: "string"
        }
    }
}