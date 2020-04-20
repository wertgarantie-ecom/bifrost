module.exports.productOfferSchema = {
    "type": "object",
    "additionalProperties": false,
    "properties": {
        "name": {
            "type": "string"
        },
        "id": {
            "type": "string",
            "pattern": "[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}"
        },
        "productType": {
            "type": "string"
        },
        "applicationCode": {
            "type": "string"
        },
        "risks": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "clientId": {
            "type": "string"
        },
        "documents": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "documentId": {
                        "type": "string"
                    },
                    "documentTitle": {
                        "type": "string"
                    },
                    "documentType": {
                        "type": "string"
                    }
                },
                "required": [
                    "documentId",
                    "documentTitle",
                    "documentType"
                ]
            }
        },
        "advantages": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "devices": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "objectCode": {
                        "type": "string"
                    },
                    "objectCodeExternal": {
                        "type": "string"
                    },
                    "maxPriceLimitation": {
                        "type": "integer"
                    },
                    "intervals": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "intervalCode": {
                                    "type": "string"
                                },
                                "description": {
                                    "type": "string"
                                },
                                "priceRangePremiums": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "minClose": {
                                                "type": "integer"
                                            },
                                            "maxOpen": {
                                                "type": "integer"
                                            },
                                            "insurancePremium": {
                                                "type": "integer"
                                            }
                                        },
                                        "required": [
                                            "minClose",
                                            "maxOpen",
                                            "insurancePremium"
                                        ]
                                    }
                                }
                            },
                            "required": [
                                "intervalCode",
                                "description",
                                "priceRangePremiums"
                            ]
                        }
                    }
                }
            }
        }
    },
    "required": [
        "devices",
        "advantages",
        "name",
        "id",
        "clientId",
        "documents",
        "productType",
        "risks"
    ]
};