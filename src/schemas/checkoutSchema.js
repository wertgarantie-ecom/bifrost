module.exports.checkoutSchema = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
        pruchasedProducts: {
            type: "array",
            items: [
                {
                    type: "object",
                    properties: {
                        price: {
                            type: "string"
                        },
                        manufacturer: {
                            type: "string"
                        },
                        deviceClass: {
                            type: "string"
                        },
                        model: {
                            type: "string"
                        },
                        productid: {
                            type: "string"
                        }
                    },
                    required: [
                        "price",
                        "manufacturer",
                        "deviceClass",
                        "model",
                        "productid"
                    ]
                },
                {
                    type: "object",
                    properties: {
                        price: {
                            type: "string"
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
        }
    },
    required: [
        "pruchasedProducts",
        "customer",
        "secretClientId"
    ]
};
