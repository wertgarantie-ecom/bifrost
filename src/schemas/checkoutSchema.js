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
                },
                {
                    type: "object",
                    properties: {
                        price: {
                            type: "integer"
                        },
                        manufacturer: {
                            type: "string"
                        },
                        class: {
                            type: "string"
                        },
                        model: {
                            type: "string"
                        },
                        productId: {
                            type: "string"
                        }
                    },
                    required: [
                        "price",
                        "manufacturer",
                        "class",
                        "model",
                        "productId"
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
        wertgarantieShoppingCart: {
            type: "string",
            required: true
        }
    },
    required: [
        "purchasedProducts",
        "customer",
        "secretClientId"
    ]
};
