const _ = require('lodash');
const shoppingCartProductSchema = _.cloneDeep(require('./addShoppingCartProductSchema').addShoppingCartProductSchema);
shoppingCartProductSchema.required.push("id");

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
}
;
