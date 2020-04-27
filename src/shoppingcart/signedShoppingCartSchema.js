const shoppingCartProductSchema = require('./addShoppingCartProductSchema').addShoppingCartProductSchema;

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
                            items: shoppingCartProductSchema
                        }
                    }
                }
            }
        }
    }
};
