const signatureService = require('../../src/shoppingcart/signatureService');
const clientService = require('../../src/clientconfig/clientService');
const documentTypes = require('../../src/documents/documentTypes').documentTypes;
const uuid = require('uuid');

exports.createAndPersistDefaultClient = async function createAndPersistDefaultClient() {
    const addNewClientRequest = this.createDefaultClient();

    return await clientService.addNewClient(addNewClientRequest);
};

exports.validCustomer = function validCustomer() {
    return {
        company: "INNOQ",
        salutation: "Herr",
        firstname: "Max",
        lastname: "Mustermann",
        street: "Unter den Linden",
        zip: "52345",
        city: "Köln",
        country: "Deutschland",
        email: "max.mustermann1234@test.com"
    }
};


exports.createSignedShoppingCart = function createSignedShoppingCart(data = {}) {
    const {clientId = "public:" + uuid(), deviceClass = "fbfb2d44-4ff8-4579-9cc0-0a3ccb8d6f2d", devicePrice = 139999, shopProductId = "1", wertgarantieProductId = "1", wertgarantieProductName = 'Basic'} = data;
    const sessionId = uuid();
    const shoppingCart =
        {
            "sessionId": sessionId,
            "clientId": clientId,
            "products": [
                {
                    "wertgarantieProductId": wertgarantieProductId,
                    "wertgarantieProductName": wertgarantieProductName,
                    "shopProductId": shopProductId,
                    "deviceClass": deviceClass,
                    "devicePrice": devicePrice,
                    "deviceCurrency": "EUR",
                    "shopProductName": "E-Mountainbike Premium 3000",
                    "orderId": "e0accedd-b087-46df-899e-91229eb43747"
                }
            ],
            "legalAgeConfirmed": false,
            "termsAndConditionsConfirmed": false
        };

    return signatureService.signShoppingCart(shoppingCart);
};

exports.createDefaultClient = function createDefaultClient() {
    return {
        name: "testclient",
        backends: {
            heimdall: {
                clientId: "e4d3237c-7582-11ea-8602-9ba3368ccb31",
                deviceClassMapping: {
                    "Smartphone": "1dfd4549-9bdc-4285-9047-e5088272dade",
                    "Bike": "6bdd2d93-45d0-49e1-8a0c-98eb80342222"
                }
            },
            webservices: {
                username: "testusername",
                password: "testpassword",
                productOffersConfigurations: []
            },
        },
        publicClientIds: [
            "public:" + uuid()
        ],
        secrets: [
            "secret:" + uuid()
        ],
        activePartnerNumber: 12345
    };
};


exports.createAndPersistDefaultClientWithWebservicesConfiguration = async function createAndPersistDefaultClientWithWebservicesConfiguratio() {
    const addNewClientRequest = this.createDefaultClientWithWebservicesConfiguration();
    return await clientService.addNewClient(addNewClientRequest);
};

exports.createDefaultClientWithWebservicesConfiguration = function createDefaultClientWithWebservicesConfiguration() {
    return {
        id: "testClientId",
        name: "testClient",
        backends: {
            heimdall: {
                clientId: "e4d3237c-7582-11ea-8602-9ba3368ccb31",
                deviceClassMapping: {
                    "Smartphone": "1dfd4549-9bdc-4285-9047-e5088272dade",
                    "Bike": "6bdd2d93-45d0-49e1-8a0c-98eb80342222"
                }
            },
            webservices: {
                username: "testusername",
                password: "testpassword",
                productOffersConfigurations: [
                    {
                        name: "Komplettschutz",
                        productType: "KOMPLETTSCHUTZ_2019",
                        applicationCode: "GU WG DE KS 0419",
                        basicRiskType: "KOMPLETTSCHUTZ",
                        defaultPaymentInterval: "monthly",
                        deviceClasses: [
                            {
                                objectCode: "9025",
                                objectCodeExternal: "Smartphone",
                                priceRanges: [
                                    {
                                        minClose: 0,
                                        maxOpen: 30000
                                    },
                                    {
                                        minClose: 30000,
                                        maxOpen: 80000
                                    },
                                    {
                                        minClose: 80000,
                                        maxOpen: 180000
                                    }
                                ]
                            },
                            {
                                objectCode: "73",
                                objectCodeExternal: "Mobilfunk",
                                priceRanges: [
                                    {
                                        minClose: 0,
                                        maxOpen: 30000
                                    },
                                    {
                                        minClose: 30000,
                                        maxOpen: 80000
                                    },
                                    {
                                        minClose: 80000,
                                        maxOpen: 180000
                                    }
                                ]
                            }

                        ],
                        documents: {
                            legalDocuments: [
                                {
                                    type: documentTypes.LEGAL_NOTICE,
                                    pattern: 'GU WG DE KS 0419_RECHTSDOKUMENTE.PDF'
                                }
                            ],
                            comparisonDocuments: []
                        },
                        advantages: [],
                        risks: []
                    },
                    {
                        name: "Komplettschutz mit Premium-Option",
                        productType: "KOMPLETTSCHUTZ_2019",
                        applicationCode: "GU WG DE KS 0419",
                        basicRiskType: "KOMPLETTSCHUTZ",
                        defaultPaymentInterval: "monthly",
                        deviceClasses: [
                            {
                                objectCode: "9025",
                                objectCodeExternal: "Smartphone",
                                priceRanges: [
                                    {
                                        minClose: 0,
                                        maxOpen: 30000
                                    },
                                    {
                                        minClose: 30000,
                                        maxOpen: 80000
                                    },
                                    {
                                        minClose: 80000,
                                        maxOpen: 180000
                                    }
                                ]
                            },
                            {
                                objectCode: "73",
                                objectCodeExternal: "Mobilfunk",
                                priceRanges: [
                                    {
                                        minClose: 0,
                                        maxOpen: 30000
                                    },
                                    {
                                        minClose: 30000,
                                        maxOpen: 80000
                                    },
                                    {
                                        minClose: 80000,
                                        maxOpen: 180000
                                    }
                                ]
                            }

                        ],
                        documents: {
                            legalDocuments: [
                                {
                                    type: documentTypes.LEGAL_NOTICE,
                                    pattern: 'GU WG DE KS 0419_RECHTSDOKUMENTE.PDF'
                                }
                            ],
                            comparisonDocuments: []
                        },
                        advantages: [],
                        risks: ["DIEBSTAHLSCHUTZ"]
                    }
                ]
            },
        },
        publicClientIds: [
            "public:" + uuid()
        ],
        secrets: [
            "secret:" + uuid()
        ],
        activePartnerNumber: 12345,
    }
};

