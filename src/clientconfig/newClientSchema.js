const productOffersConfigSchema = require('../backends/webservices/productOffersConfigSchema').productOffersConfigSchema;
const features = require('../handbook/features');

module.exports.newClientSchema = {
    type: "object",
    additionalProperties: false,
    required: [
        "id",
        "name",
        "secrets",
        "publicClientIds"
    ],
    properties: {
        id: {
            "type": "uuid"
        },
        name: {
            "type": "string",
        },
        email: {
            "type": "string"
        },
        backends: {
            required: [
                "webservices"
            ],
            type: "object",
            properties: {
                webservices: {
                    type: "object",
                    properties: {
                        username: {
                            "type": "string"
                        },
                        password: {
                            "type": "string"
                        },
                        productOffersConfigurations: productOffersConfigSchema
                    },
                    required: [
                        "username",
                        "password",
                        "productOffersConfigurations"
                    ]
                },
            }
        },
        activePartnerNumber: {
            type: "integer"
        },
        secrets: {
            type: "array",
            items: {
                type: "string"
            }
        },
        publicClientIds: {
            type: "array",
            items: {
                type: "string"
            }
        },
        basicAuthUser: {
            type: "string",
        },
        basicAuthPassword: {
            type: "string"
        },
        loaderConfig: {
            type: "array",
            items: {
                type: "object"
            }
        },
        handbook: {
            type: "object",
            properties: {
                features: {
                    type: "array",
                    items: {
                        type: "string",
                        enum: features
                    }
                },
                components: {
                    type: "object",
                    properties: {
                        selectionpopup: {
                            type: "object",
                            properties: {
                                sample: {
                                    type: "string"
                                }
                            }
                        },
                        confirmation: {
                            type: "object",
                            properties: {
                                sample: {
                                    type: "string"
                                }
                            }
                        },
                        aftersales: {
                            type: "object",
                            properties: {
                                sample: {
                                    type: "string"
                                }
                            }
                        }
                    }
                }
            }
        }

    }
};
