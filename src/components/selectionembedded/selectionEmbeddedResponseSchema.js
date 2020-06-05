const advantageSchema = require('../selectiongeneral/advantageSchema').advantageSchema;
const selectionEmbeddedTextsSchema = require('./selectionEmbeddedTextsSchema').selectionEmbeddedTextsSchema;


exports.selectionEmbeddedResponseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema",
    "$id": "http://example.com/example.json",
    "type": "object",
    "required": [
        "texts",
        "products"
    ],
    "properties": {
        "texts": selectionEmbeddedTextsSchema,
        "products": {
            "type": "array",
            "items": {
                "type": "object",
                "required": [
                    "id",
                    "name",
                    "shortName",
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