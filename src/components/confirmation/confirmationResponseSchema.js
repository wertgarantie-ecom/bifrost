const shoppingCartSchema = require("../../shoppingcart/schemas/signedShoppingCartSchema").signedSchoppingCartSchema.properties.shoppingCart;
const confirmationTextsSchema = require('./confirmationTextsSchema').confirmationTextsSchema;

exports.confirmationResponseSchema = {
    type: "object",
    required: [
        "shoppingCart",
        "texts",
        "termsAndConditionsConfirmed",
        "orders"
    ],
    properties: {
        shoppingCart: shoppingCartSchema,
        texts: confirmationTextsSchema,
        termsAndConditionsConfirmed: {
            type: "boolean"
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
                    "productBackgroundImageLink",
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
                    productBackgroundImageLink: {
                        type: "string"
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