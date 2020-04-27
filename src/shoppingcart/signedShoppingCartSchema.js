module.exports.requestWithSignedShoppingCartSchema = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
        signedShoppingCart: {
            type: "object",
            additionalProperties: false,
            properties: {
                signature: {
                    type: "string",
                    required: true
                },
                shoppingCart: {
                    type: "object",
                    properties: {
                        publicClientId: {
                            type: "string",
                            required: true
                        },
                        confirmations: {
                            termsAndConditionsConfirmed: {
                                type: "boolean",
                                required: true
                            },
                            legalAgeConfirmed: {
                                type: "boolean",
                                required: true
                            },
                        },
                        orders: {
                            type: "array",
                            items: [
                                {
                                    type: "object",
                                    properties: {
                                        shopProduct: {
                                            type: "object",
                                            properties: {
                                                model: {
                                                    type: "string"
                                                },
                                                price: {
                                                    type: "integer"
                                                },
                                                deviceClass: {
                                                    type: "string"
                                                }
                                            },
                                            required: [
                                                "model",
                                                "price",
                                                "deviceClass"
                                            ]
                                        },
                                        wertgarantieProduct: {
                                            type: "object",
                                            properties: {
                                                id: {
                                                    type: "string"
                                                },
                                                name: {
                                                    type: "string"
                                                },
                                                paymentInterval: {
                                                    type: "string"
                                                },
                                            },
                                            required: [
                                                "id",
                                                "name",
                                                "paymentInterval"
                                            ]
                                        }
                                    },
                                    required: [
                                        "shopProduct",
                                        "wertgarantieProduct"
                                    ],
                                    additionalProperties: false
                                }
                            ]
                        }
                    }
                }
            }
        }
    }
};
