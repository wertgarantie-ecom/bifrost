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
        "backends": {
            "type": "object",
            "properties": {
                "webservices": {
                    "type": "object",
                    "properties": {
                        "username": {
                            "type": "string"
                        },
                        "password": {
                            "type": "string"
                        },
                        "productOffersConfigurations": productOffersConfigSchema
                    },
                    "required": [
                        "username",
                        "password",
                        "productOffersConfigurations"
                    ]
                },
                "heimdall": {
                    "type": "object",
                    "properties": {
                        "clientId": {
                            "type": "string"
                        },
                        "deviceClassMapping": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "object",
                                "properties": {
                                    "heimdallDeviceClass": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
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
        }
    }
};
