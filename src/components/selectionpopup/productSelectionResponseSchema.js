const selectionPopUpTextsSchema = require("./selectionPopUpTextsSchema").selectionPopUpTextsSchema;

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
                        "items": {
                            "type": "string",
                        }
                    },
                    "advantages": {
                        "type": "array",
                        "items": {
                            "type": "string",
                        }
                    },
                    "excludedAdvantages": {
                        "type": "array",
                        "items": {
                            "type": "string",
                        }
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