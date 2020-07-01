const shoppingCartSchema = require("../../shoppingcart/schemas/signedShoppingCartSchema").signedSchoppingCartSchema.properties.shoppingCart;
const confirmationTextsSchema = require('./confirmationTextsSchema').confirmationTextsSchema;

exports.confirmationResponseSchema = {
    type: "object",
    required: [
        "shoppingCart",
        "texts",
        "confirmations",
        "orders"
    ],
    properties: {
        shoppingCart: shoppingCartSchema,
        texts: confirmationTextsSchema,
        confirmations: {
            type: "object",
            required: [
                "termsAndConditionsConfirmed",
                "confirmationTextTermsAndConditions"
            ],
            properties: {
                termsAndConditionsConfirmed: {
                    type: "boolean"
                },
                confirmationTextTermsAndConditions: {
                    type: "string"
                },
                furtherConfirmations: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string"
                            },
                            confirmed: {
                                type: "boolean"
                            },
                            cofirmationText: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        },
        orders: {
            type: "array",
            items: {
                type: "object",
                additionalProperties: false,
                required: [
                    "paymentInterval",
                    "price",
                    "includedTax",
                    "productTitle",
                    "top3",
                    "IPIDUri",
                    "IPIDText",
                    "productImageLink",
                    "backgroundStyle",
                    "shopProductShortName",
                    "orderId",
                    "updated"
                ],
                properties: {
                    paymentInterval: {
                        type: "string"
                    },
                    price: {
                        type: "string"
                    },
                    includedTax: {
                        type: "string"
                    },
                    productTitle: {
                        type: "string"
                    },
                    top3: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    },
                    IPIDUri: {
                        type: "string"
                    },
                    IPIDText: {
                        type: "string"
                    },
                    productImageLink: {
                        type: "string"
                    },
                    backgroundStyle: {
                        type: "string",
                        enum: [
                            "primary",
                            "secondary"
                        ]
                    },
                    shopProductShortName: {
                        type: "string"
                    },
                    orderId: {
                        type: "string"
                    },
                    updated: {
                        boolean: "string"
                    }
                }
            }
        }
    }
};