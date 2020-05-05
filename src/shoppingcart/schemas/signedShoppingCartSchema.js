const orderSchema = require('./orderSchema');

exports.signedSchoppingCartSchema = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    additionalProperties: false,
    properties: {
        signature: {
            type: "string",
            required: true
        },
        shoppingCart: {
            type: "object",
            additionalProperties: false,
            required: [
                "sessionId",
                "publicClientId",
                "confirmations",
                "orders"
            ],
            properties: {
                sessionId: {
                    type: "string"
                },
                publicClientId: {
                    type: "string",
                    required: true
                },
                confirmations: {
                    type: "object",
                    properties: {
                        termsAndConditionsConfirmed: {
                            type: "boolean",
                            required: true
                        }
                    }
                },
                orders: {
                    type: "array",
                    items: orderSchema
                }
            }
        }
    }
};