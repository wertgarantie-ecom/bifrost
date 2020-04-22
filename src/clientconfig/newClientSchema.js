const productOffersConfigSchema = require('./productOffersConfigSchema').productOffersConfigSchema;

module.exports.newClientSchema = {
    "type": "object",
    "additionalProperties": false,
    "required": [
        "id",
        "name",
        "secrets",
        "publicClientIds"
    ],
    "properties": {
        "id": {
            "type": "uuid"
        },
        "name": {
            "type": "string",
        },
        "heimdallClientId": {
            "type": "string"
        },
        "webservices": {
            "type": "object",
            "properties": {
                "username": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                }
            },
            "required": [
                "username",
                "password"
            ]
        },
        "activePartnerNumber": {
            "type": "integer"
        },
        "secrets": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "publicClientIds": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "productOffersConfigurations": productOffersConfigSchema
    }
};
