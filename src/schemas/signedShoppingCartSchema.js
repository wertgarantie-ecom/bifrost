module.exports.requestWithSignedShoppingCartSchema = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
        signedShoppingCart: {
            type: "object",
            properties: {
                clientId: {
                    type: "uuid",
                    required: true
                },
                signature: {
                    type: "string",
                    required: true
                },
                confirmed: {
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
                                shopProductId: {
                                    type: "string",
                                    required: true
                                },
                                deviceClass: {
                                    type: "string",
                                    required: true
                                },
                                devicePrice: {
                                    type: "string",
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
};
