const signedShoppingCartSchema = require('./signedShoppingCartSchema').signedSchoppingCartSchema;

module.exports.checkoutSchema = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
        orderId: {
            type: "string"
        },
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
                        deviceClasses: {
                            type: "string"
                        },
                        name: {
                            type: "string"
                        },
                        orderItemId: {
                            type: "string"
                        }
                    },
                    required: [
                        "price",
                        "name"
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
                "firstname",
                "lastname",
                "street",
                "zip",
                "city",
                "country",
                "email"
            ]
        },
        signedShoppingCart: signedShoppingCartSchema
    },
    required: [
        "purchasedProducts",
        "customer"
    ]
};
