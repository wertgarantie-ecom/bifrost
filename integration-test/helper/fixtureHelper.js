const signatureService = require('../../src/services/signatureService');
const clientService = require('../../src/services/clientService');
const documentTypes = require('../../src/services/documentTypes').documentTypes;
const uuid = require('uuid');

exports.createAndPersistDefaultClient = async function createAndPersistDefaultClient() {
    const addNewClientRequest = this.createDefaultClient();

    return await clientService.addNewClient(addNewClientRequest);
};

exports.createSignedShoppingCart = function createSignedShoppingCart(data = {}) {
    const {clientId = "public:" + uuid(), deviceClass = "fbfb2d44-4ff8-4579-9cc0-0a3ccb8d6f2d", devicePrice = 139999, shopProductId = "1", wertgarantieProductId = 1, wertgarantieProductName = 'Basic'} = data;
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
        heimdallClientId: "e4d3237c-7582-11ea-8602-9ba3368ccb31",
        webservices: {
            username: "testusername",
            password: "testpassword",
        },
        publicClientIds: [
            "public:testclient-publicId"
        ],
        secrets: [
            "secret:testclient-secret"
        ],
        activePartnerNumber: 12345,

    };
};

exports.createDefaultClientWithWebservicesConfiguration = function createDefaultClientWithWebservicesConfiguration() {
    return {
        id: "testClientId",
        name: "testClient",
        heimdallClientId: "e4d3237c-7582-11ea-8602-9ba3368ccb31",
        webservices: {
            username: "testusername",
            password: "testpassword",
        },
        publicClientIds: [
            "public:testclient-publicId"
        ],
        secrets: [
            "secret:testclient-secret"
        ],
        activePartnerNumber: 12345,
        productOffersConfigurations: [
            {
                name: "Komplettschutz",
                productType: "KOMPLETTSCHUTZ_2019",
                applicationCode: "GU WG DE KS 0419",
                basicRiskType: "KOMPLETTSCHUTZ",
                deviceClasses: [
                    {
                        objectCode: "9025",
                        objectCodeExternal: "Smartphone",
                        priceRanges: [
                            {
                                minClose: 0,
                                maxOpen: 300
                            },
                            {
                                minClose: 300,
                                maxOpen: 800
                            },
                            {
                                minClose: 800,
                                maxOpen: 1800
                            }
                        ]
                    },
                    {
                        objectCode: "73",
                        objectCodeExternal: "Mobilfunk",
                        priceRanges: [
                            {
                                minClose: 0,
                                maxOpen: 300
                            },
                            {
                                minClose: 300,
                                maxOpen: 800
                            },
                            {
                                minClose: 800,
                                maxOpen: 1800
                            }
                        ]
                    }

                ],
                documentTypes: {
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
                deviceClasses: [
                    {
                        objectCode: "9025",
                        objectCodeExternal: "Smartphone",
                        priceRanges: [
                            {
                                minClose: 0,
                                maxOpen: 300
                            },
                            {
                                minClose: 300,
                                maxOpen: 800
                            },
                            {
                                minClose: 800,
                                maxOpen: 1800
                            }
                        ]
                    },
                    {
                        objectCode: "73",
                        objectCodeExternal: "Mobilfunk",
                        priceRanges: [
                            {
                                minClose: 0,
                                maxOpen: 300
                            },
                            {
                                minClose: 300,
                                maxOpen: 800
                            },
                            {
                                minClose: 800,
                                maxOpen: 1800
                            }
                        ]
                    }

                ],
                documentTypes: {
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
    }
};

