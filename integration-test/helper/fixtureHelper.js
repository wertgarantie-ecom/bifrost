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
    const {publicClientId = "public:" + uuid(), deviceClass = "Bike", devicePrice = 139999, wertgarantieProductId = "1", wertgarantieProductName = 'Basic', model = "E-Mountainbike Premium 3000", quantity = 1} = data;
    const sessionId = uuid();
    const shoppingCart = {
        sessionId: sessionId,
        publicClientId: publicClientId,
        orders: [],
        confirmations: {
            termsAndConditionsConfirmed: false
        }
    };
    for (var i = 0; i < quantity; i++) {
        shoppingCart.orders.push({
            shopProduct: {
                orderItemId: uuid(),
                model: model,
                price: devicePrice,
                deviceClass: deviceClass,
            },
            wertgarantieProduct: {
                id: wertgarantieProductId,
                name: wertgarantieProductName,
                paymentInterval: "monthly",
                price: 500
            },
            id: uuid()
        });
    }

    return signatureService.signShoppingCart(shoppingCart);
};

exports.createDefaultClient = function createDefaultClient() {
    return {
        id: uuid(),
        name: "testclient",
        backends: {
            heimdall: {
                clientId: "e4d3237c-7582-11ea-8602-9ba3368ccb31",
                deviceClassMappings: [
                    {
                        shopDeviceClass: "Smartphone",
                        heimdallDeviceClass: "1dfd4549-9bdc-4285-9047-e5088272dade"
                    },
                    {
                        shopDeviceClass: "Bike",
                        heimdallDeviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222"
                    },
                    {
                        shopDeviceClass: "Test",
                        heimdallDeviceClass: "fbfb2d44-4ff8-4579-9cc0-0a3ccb8d6f2d"
                    }
                ]
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

exports.getValidPurchase = function getValidPurchase() {
    return {
        wertgarantieProductId: "10",
        wertgarantieProductName: "Basic",
        deviceClass: "0dc47b8a-f984-11e9-adcf-afabcc521093",
        devicePrice: 139999,
        success: true,
        message: "what a nice purchase",
        shopProduct: "iPhone X",
        contractNumber: "23479998",
        transactionNumber: "7524545",
        backend: "heimdall",
        backendResponseInfo: {
            activationCode: "a447s7s6666f"
        }
    }
}

exports.createAndPersistDefaultClientWithWebservicesConfiguration = async function createAndPersistDefaultClientWithWebservicesConfiguratio() {
    const addNewClientRequest = this.createDefaultClientWithWebservicesConfiguration();
    return await clientService.addNewClient(addNewClientRequest);
};

exports.createDefaultClientWithWebservicesConfiguration = function createDefaultClientWithWebservicesConfiguration() {
    return {
        id: uuid(),
        name: "testClient",
        backends: {
            heimdall: {
                clientId: "e4d3237c-7582-11ea-8602-9ba3368ccb31",
                deviceClassMappings: [
                    {
                        shopDeviceClass: "Smartphone",
                        heimdallDeviceClass: "1dfd4549-9bdc-4285-9047-e5088272dade"
                    },
                    {
                        shopDeviceClass: "Bike",
                        heimdallDeviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222"
                    }
                ]
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
                                        maxOpen: 180001
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
                                        maxOpen: 180001
                                    }
                                ]
                            }

                        ],
                        documents: {
                            legalDocuments: [
                                documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,
                                documentTypes.GENERAL_DATA_PROTECTION_REGULATION,
                                documentTypes.RIGHT_OF_WITHDRAWAL
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
                                        maxOpen: 180001
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
                                        maxOpen: 180001
                                    }
                                ]
                            }

                        ],
                        documents: {
                            legalDocuments: [
                                documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,
                                documentTypes.GENERAL_DATA_PROTECTION_REGULATION,
                                documentTypes.RIGHT_OF_WITHDRAWAL
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
        activePartnerNumber: 12345
    }
};

