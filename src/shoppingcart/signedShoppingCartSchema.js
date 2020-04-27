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
                            type: "string",
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
                                            type: "string",
                                            required: true
                                        },
                                        wertgarantieProductName: {
                                            type: "string",
                                            required: true
                                        },
                                        wertgarantieDeviceClass: {
                                            type: "string",
                                            required: true
                                        },
                                        shopDeviceClass: {
                                            type: "string",
                                            required: true
                                        },
                                        shopDevicePrice: {
                                            type: "integer",
                                            required: true
                                        },
                                        shopProductModel: {
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
