exports.selectionPopUpTextsSchema = {
    type: "object",
    additionalProperties: false,
    required: [
        "title",
        "subtitle",
        "shopName"
    ],
    properties: {
        title: {
            type: "stirng"
        },
        subtitle: {
            type: "string"
        },
        shopName: {
            type: "string"
        }
    }
}
