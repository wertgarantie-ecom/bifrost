module.exports.productOffersConfigSchema = {
    "type": "array",
    "items": {
        "type": "object",
        "required": [
            "name",
            "productType",
            "applicationCode",
            "basicRiskType",
            "deviceClasses",
            "documents",
            "advantages",
            "defaultPaymentInterval",
            "risks"
        ],
        "properties": {
            "name": {
                "type": "string",
            },
            "productType": {
                "type": "string",
            },
            "applicationCode": {
                "type": "string",
            },
            "basicRiskType": {
                "type": "string",
            },
            "defaultPaymentInterval": {
                "type": "string",
                "enum": ["monthly", "quarterly", "halfYearly", "yearly"]
            },
            "deviceClasses": {
                "type": "array",
                "items": {
                    "type": "object",
                    "required": [
                        "objectCode",
                        "objectCodeExternal",
                        "priceRanges"
                    ],
                    "properties": {
                        "objectCode": {
                            "type": "string",
                        },
                        "objectCodeExternal": {
                            "type": "string",
                        },
                        "priceRanges": {
                            "type": "array",
                            "additionalItems": true,
                            "items": {
                                "type": "object",
                                "required": [
                                    "minClose",
                                    "maxOpen"
                                ],
                                "properties": {
                                    "minClose": {
                                        "type": "integer",
                                    },
                                    "maxOpen": {
                                        "type": "integer",
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "documents": {
                "type": "object",
                "required": [
                    "legalDocuments",
                    "comparisonDocuments"
                ],
                "properties": {
                    "legalDocuments": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "required": [
                                "type",
                                "pattern"
                            ],
                            "properties": {
                                "type": {
                                    "type": "string",
                                },
                                "pattern": {
                                    "type": "string",
                                }
                            }
                        }
                    },
                    "comparisonDocuments": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "required": [
                                "type",
                                "pattern"
                            ],
                            "properties": {
                                "type": {
                                    "type": "string",
                                },
                                "pattern": {
                                    "type": "string",
                                }
                            }
                        }
                    }
                }
            },
            "advantages": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "risks": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            }
        }
    }
};