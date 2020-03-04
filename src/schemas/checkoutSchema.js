module.exports.checkoutSchema = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
        purchasedProducts: {
            type: "array",
            items: [
                {
                    type: "object",
                    properties: {
                        price: {
                            type: "integer"
                        },
                        manufacturer: {
                            type: "string"
                        },
                        deviceClass: {
                            type: "string"
                        },
                        model: {
                            type: "string"
                        }
                    },
                    required: [
                        "price",
                        "manufacturer",
                        "deviceClass",
                        "model"
                    ]
                }
            ]
        },
        customer: {
            type: "object",
            properties: {
                company: {
                    type: "string"
                },
                salutation: {
                    type: "string"
                },
                firstname: {
                    type: "string"
                },
                lastname: {
                    type: "string"
                },
                street: {
                    type: "string"
                },
                zip: {
                    type: "string"
                },
                city: {
                    type: "string"
                },
                country: {
                    type: "string"
                },
                email: {
                    type: "string"
                }
            },
            required: [
                "company",
                "salutation",
                "firstname",
                "lastname",
                "street",
                "zip",
                "city",
                "country",
                "email"
            ]
        },
        secretClientId: {
            type: "string"
        },
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
    },
    required: [
        "purchasedProducts",
        "customer",
        "secretClientId"
    ]
};
