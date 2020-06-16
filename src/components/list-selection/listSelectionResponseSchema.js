const listSelectionTextsSchema = require('./listSelectionTextsSchema').listSelectionTextsSchema;
const selectionEmbeddedResponseSchema = require('../selectionembedded/selectionEmbeddedResponseSchema').selectionEmbeddedResponseSchema;

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
                    embeddedSelectionData: selectionEmbeddedResponseSchema
                }
            }
        },
        listSelectionComponentTexts: listSelectionTextsSchema
    },
    required: [
        "insurableProductRows",
        "listSelectionComponentTexts"
    ]
};