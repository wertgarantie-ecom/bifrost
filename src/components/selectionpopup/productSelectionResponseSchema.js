const selectionPopUpTextsSchema = require("./selectionPopUpTextsSchema").selectionPopUpTextsSchema;
const advantageSchema = require('../selectiongeneral/advantageSchema').advantageSchema;

module.exports.productSelectionResponseSchema = {
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
                    "deviceClass",
                    "shopDeviceClass",
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
                    "deviceClass": {
                        "type": "string",
                    },
                    "shopDeviceClass": {
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
        },
        "offeredOrderItemIds": {
            "type": "array",
            "items": {
                "type": "string"
            }
        }
    }

};