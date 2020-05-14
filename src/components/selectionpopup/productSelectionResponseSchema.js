const selectionPopUpTextsSchema = require("./selectionPopUpTextsSchema").selectionPopUpTextsSchema;

const advantageSchema = {
    "type": "object",
    "properties": {
        "text": {
            "type": "string"
        },
        "included": {
            "type": "boolean"
        }
    }
};

module.exports.productSelectionResponseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema",
    "$id": "http://example.com/example.json",
    "type": "object",
    "required": [
        "texts",
        "products"
    ],
    "properties": {
        "texts": selectionPopUpTextsSchema,
        "products": {
            "type": "array",
            "items": {
                "type": "object",
                "required": [
                    "id",
                    "name",
                    "top3",
                    "advantages",
                    "IPIDText",
                    "IPIDUri",
                    "GTCIText",
                    "GTCIUri",
                    "priceFormatted",
                    "price",
                    "taxFormatted",
                    "imageLink"
                ],
                "properties": {
                    "id": {
                        "type": "string",
                    },
                    "name": {
                        "type": "string",
                    },
                    "top3": {
                        "type": "array",
                        "items": advantageSchema
                    },
                    "advantages": {
                        "type": "array",
                        "items": advantageSchema
                    },
                    "excludedAdvantages": {
                        "type": "array",
                        "items": advantageSchema
                    },
                    "IPIDText": {
                        "type": "string",
                    },
                    "IPIDUri": {
                        "type": "string",
                    },
                    "GTCIText": {
                        "type": "string",
                    },
                    "GTCIUri": {
                        "type": "string",
                    },
                    "priceFormatted": {
                        "type": "string",
                    },
                    "price": {
                        "type": "integer",
                    },
                    "taxFormatted": {
                        "type": "string",
                    },
                    "imageLink": {
                        "type": "string",
                    }
                }
            }
        }
    }
};