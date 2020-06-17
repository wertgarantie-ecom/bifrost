const listSelectionTextsSchema = require('./listSelectionTextsSchema').listSelectionTextsSchema;

exports.listSelectionResponseSchema = {
    type: "object",
    properties: {
        insurableProductRows: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    shopProductImageLink: {
                        type: "string"
                    },
                    shopProductName: {
                        type: "string"
                    },
                    embeddedSelectionDataBase64: {
                        type: "string"
                    }
                },
                required: [
                    "shopProductName",
                    "embeddedSelectionDataBase64"
                ]
            }
        },
        listSelectionComponentTexts: listSelectionTextsSchema
    },
    required: [
        "insurableProductRows",
        "listSelectionComponentTexts"
    ]
};