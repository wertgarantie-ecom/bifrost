module.exports.productSelectionResponseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema",
    "$id": "http://example.com/example.json",
    "type": "object",
    "required": [
        "title",
        "products"
    ],
    "properties": {
        "title": {
            "type": "string",
        },
        "products": {
            "type": "array",
            "items": {
                "type": "object",
                "required": [
                    "id",
                    "name",
                    "top3",
                    "advantages",
                    "infoSheetText",
                    "infoSheetUri",
                    "detailsDocText",
                    "detailsDocUri",
                    "paymentInterval",
                    "price",
                    "currency",
                    "priceFormatted",
                    "tax",
                    "taxFormatted",
                    "imageLink"
                ],
                "properties": {
                    "id": {
                        "type": "integer",
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
                    "infoSheetText": {
                        "type": "string",
                    },
                    "infoSheetUri": {
                        "type": "string",
                    },
                    "detailsDocText": {
                        "type": "string",
                    },
                    "detailsDocUri": {
                        "type": "string",
                    },
                    "paymentInterval": {
                        "type": "string",
                    },
                    "price": {
                        "type": "string",
                    },
                    "currency": {
                        "type": "string",
                    },
                    "priceFormatted": {
                        "type": "string",
                    },
                    "tax": {
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