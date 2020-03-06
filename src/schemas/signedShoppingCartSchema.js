module.exports.requestWithSignedShoppingCartSchema = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
        signedShoppingCart: {
            type: "object",
            properties: {
                signature: {
                    type: "string",
                    required: true
                },
                shoppingCart: {
                    type: "object",
                    properties: {
                        clientId: {
                            type: "uuid",
                            required: true
                        },
                        termsAndConditionsConfirmed: {
                            type: "boolean",
                            required: true
                        },
                        legalAgeConfirmed: {
                            type: "boolean",
                            required: true
                        },
                        products: {
                            type: "array",
                            items: [
                                {
                                    type: "object",
                                    properties: {
                                        wertgarantieProductId: {
                                            type: "integer",
                                            required: true
                                        },
                                        deviceClass: {
                                            type: "string",
                                            required: true
                                        },
                                        devicePrice: {
                                            type: "integer",
                                            required: true
                                        },
                                        shopProductName: {
                                            type: "string",
                                            required: true
                                        },
                                        orderId: {
                                            type: "uuid",
                                            required: true
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        }
    }
};
