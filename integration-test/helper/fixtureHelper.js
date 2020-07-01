const signatureService = require('../../src/shoppingcart/signatureService');
const clientService = require('../../src/clientconfig/clientService');
const documentTypes = require('../../src/documents/documentTypes').documentTypes;
const uuid = require('uuid');
const features = require('../../src/handbook/features');

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
    const {publicClientId = "public:" + uuid(), shopDeviceClass = "Bike", deviceClass = "73", devicePrice = 139999, wertgarantieProductId = "1", wertgarantieProductName = 'Basic', name = "E-Mountainbike Premium 3000", quantity = 1} = data;
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
                name: name,
                price: devicePrice,
                deviceClasses: shopDeviceClass,
            },
            wertgarantieProduct: {
                id: wertgarantieProductId,
                name: wertgarantieProductName,
                paymentInterval: "monthly",
                shopDeviceClass: shopDeviceClass,
                deviceClass: deviceClass,
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
        activePartnerNumber: 12345,
        basicAuthUser: "testclient",
        basicAuthPassword: "testclient"
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
        backend: "webservices",
        backendResponseInfo: {
            activationCode: "a447s7s6666f"
        }
    }
};

exports.createAndPersistPhoneClientWithWebservicesConfiguration = async function createAndPersistPhoneClientWithWebservicesConfiguration() {
    const addNewClientRequest = this.createDefaultClientWithWebservicesConfiguration();
    return await createAndPersistClient(addNewClientRequest);
};

exports.createAndPersistBikeClientWithWebservicesConfiguration = async function createAndPersistBikeClientWithWebservicesConfiguration() {
    const addNewClientRequest = this.createBikeClientWithWebservicesConfiguration();
    return await createAndPersistClient(addNewClientRequest);
};

async function createAndPersistClient(clientConfig) {
    const doNotAssembleProductOffers = {
        updateAllProductOffersForClient: _ => _
    };
    return await clientService.addNewClient(clientConfig, undefined, undefined, doNotAssembleProductOffers);
}

exports.createDefaultClientWithWebservicesConfiguration = function createDefaultClientWithWebservicesConfiguration() {
    return {
        id: uuid(),
        name: "testClient",
        backends: {
            webservices: {
                username: "testusername",
                password: "testpassword",
                productOffersConfigurations: [
                    {
                        name: "Komplettschutz",
                        shortName: "Basisschutz",
                        productType: "KOMPLETTSCHUTZ_2019",
                        applicationCode: "GU WG DE KS 0419",
                        basicRiskType: "KOMPLETTSCHUTZ",
                        defaultPaymentInterval: "monthly",
                        productImageLink: "productImageLink",
                        backgroundStyle: "primary",
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
                        ],
                        deviceClasses: [
                            {
                                objectCode: "9025",
                                objectCodeExternal: "Smartphone"
                            },
                            {
                                objectCode: "73",
                                objectCodeExternal: "Test"
                            }

                        ],
                        documents: {
                            legalDocuments: [
                                documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,
                                documentTypes.GENERAL_DATA_PROTECTION_REGULATION,
                                documentTypes.RIGHT_OF_WITHDRAWAL
                            ]
                        },
                        advantages: ["advantage1", "advantage2", "advantage3"],
                        risks: []
                    },
                    {
                        name: "Komplettschutz mit Premium-Option",
                        shortName: "Premiumschutz",
                        productType: "KOMPLETTSCHUTZ_2019",
                        applicationCode: "GU WG DE KS 0419",
                        basicRiskType: "KOMPLETTSCHUTZ",
                        defaultPaymentInterval: "monthly",
                        productImageLink: "productImageLink",
                        backgroundStyle: "secondary",
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
                        ],
                        deviceClasses: [
                            {
                                objectCode: "9025",
                                objectCodeExternal: "Smartphone"
                            },
                            {
                                objectCode: "73",
                                objectCodeExternal: "Test"
                            }

                        ],
                        documents: {
                            legalDocuments: [
                                documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,
                                documentTypes.GENERAL_DATA_PROTECTION_REGULATION,
                                documentTypes.RIGHT_OF_WITHDRAWAL
                            ]
                        },
                        advantages: ["advantage1", "advantage2", "advantage3", "advantage4"],
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
        basicAuthUser: "testclient",
        basicAuthPassword: "testclient",
        handbook: {
            features: features,
            components: {
                selectionpopup: {
                    samples: "www.example.com"
                },
                confirmation: {
                    samples: "www.example.com"
                },
                aftersales: {
                    samples: "www.example.com"
                }

            }
        }
    }
};

exports.createBikeClientWithWebservicesConfiguration = function createBikeClientWithWebservicesConfiguration() {
    return {
        id: uuid(),
        name: "testClient",
        backends: {
            webservices: {
                username: "test-bike-user",
                password: "test-bike-password",
                productOffersConfigurations: [
                    {
                        "name": "Fahrrad-Komplettschutz mit monatlicher Zahlweise",
                        "shortName": "Variante A",
                        "productType": "KOMPLETTSCHUTZ_RAD_M_2018",
                        "applicationCode": "GU WG DE RAD KS 0818",
                        "basicRiskType": "KOMPLETTSCHUTZ_RAD",
                        "defaultPaymentInterval": "monthly",
                        "productImageLink": "productImageLink",
                        "backgroundStyle": "primary",
                        "priceRanges": [
                            {
                                "minClose": 0,
                                "maxOpen": 50001
                            },
                            {
                                "minClose": 50001,
                                "maxOpen": 75001
                            },
                            {
                                "minClose": 75001,
                                "maxOpen": 100001
                            },
                            {
                                "minClose": 100001,
                                "maxOpen": 150001
                            },
                            {
                                "minClose": 150001,
                                "maxOpen": 200001
                            },
                            {
                                "minClose": 200001,
                                "maxOpen": 400000
                            }
                        ],
                        "lock": {
                            "priceRanges": [
                                {
                                    "minClose": 0,
                                    "maxOpen": 100001,
                                    "requiredLockPrice": 1900
                                },
                                {
                                    "minClose": 100001,
                                    "maxOpen": 400001,
                                    "requiredLockPrice": 4900
                                }
                            ]
                        },
                        "deviceClasses": [
                            {
                                "objectCode": "27",
                                "objectCodeExternal": "Bike"
                            }

                        ],
                        "documents": {
                            "legalDocuments": [
                                documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,
                                documentTypes.GENERAL_DATA_PROTECTION_REGULATION,
                                documentTypes.RIGHT_OF_WITHDRAWAL
                            ]
                        },
                        "advantages": [
                            "Verschleiß / Abnutzung / Alterung der Reifen und Schläuche (ab dem 7. Monat)",
                            "Materialfehler",
                            "Konstruktionsfehler",
                            "Produktionsfehler",
                            "Reparaturkosten",
                            "Unsachgemäße Handhabung",
                            "Vandalismus",
                            "Fall- und Sturzschäden",
                            "Unfallschäden",
                            "Diebstahl des Fahrrads",
                            "Teilediebstahl"
                        ],
                        "risks": []
                    },
                    {
                        "name": "Fahrrad-Komplettschutz mit jährlicher Zahlweise",
                        "shortName": "Variante B",
                        "productType": "KOMPLETTSCHUTZ_RAD_J_2018",
                        "applicationCode": "GU WG DE RAD KS 0818",
                        "basicRiskType": "KOMPLETTSCHUTZ_RAD",
                        "defaultPaymentInterval": "yearly",
                        "productImageLink": "productImageLink",
                        "backgroundStyle": "secondary",
                        "priceRanges": [
                            {
                                "minClose": 0,
                                "maxOpen": 50001
                            },
                            {
                                "minClose": 50001,
                                "maxOpen": 75001
                            },
                            {
                                "minClose": 75001,
                                "maxOpen": 100001
                            },
                            {
                                "minClose": 100001,
                                "maxOpen": 150001
                            },
                            {
                                "minClose": 150001,
                                "maxOpen": 200001
                            },
                            {
                                "minClose": 200001,
                                "maxOpen": 400000
                            }
                        ],
                        "lock": {
                            "priceRanges": [
                                {
                                    "minClose": 0,
                                    "maxOpen": 100001,
                                    "requiredLockPrice": 1900
                                },
                                {
                                    "minClose": 100001,
                                    "maxOpen": 400001,
                                    "requiredLockPrice": 4900
                                }
                            ]
                        },
                        "deviceClasses": [
                            {
                                "objectCode": "27",
                                "objectCodeExternal": "Bike"
                            }
                        ],
                        "documents": {
                            "legalDocuments": [
                                documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,
                                documentTypes.GENERAL_DATA_PROTECTION_REGULATION,
                                documentTypes.RIGHT_OF_WITHDRAWAL
                            ]
                        },
                        "advantages": [
                            "Materialfehler",
                            "Konstruktionsfehler",
                            "Produktionsfehler",
                            "Reparaturkosten",
                            "Unsachgemäße Handhabung",
                            "Vandalismus",
                            "Fall- und Sturzschäden",
                            "Unfallschäden",
                            "Diebstahl des Fahrrads",
                            "Teilediebstahl"
                        ],
                        "risks": []
                    },
                    {
                        "name": "E-Bike-Komplettschutz mit monatlicher Zahlweise",
                        "shortName": "Variante A",
                        "productType": "KOMPLETTSCHUTZ_EBIKE_M_2018",
                        "applicationCode": "GU WG DE RAD EBS 0818",
                        "basicRiskType": "KOMPLETTSCHUTZ_EBIKE",
                        "defaultPaymentInterval": "monthly",
                        "productImageLink": "productImageLink",
                        "backgroundStyle": "primary",
                        "priceRanges": [
                            {
                                "minClose": 0,
                                "maxOpen": 150001
                            },
                            {
                                "minClose": 150001,
                                "maxOpen": 300001
                            },
                            {
                                "minClose": 300001,
                                "maxOpen": 400001
                            },
                            {
                                "minClose": 400001,
                                "maxOpen": 600000
                            }
                        ],
                        "lock": {
                            "priceRanges": [
                                {
                                    "minClose": 0,
                                    "maxOpen": 600001,
                                    "requiredLockPrice": 4900
                                }
                            ]
                        },
                        "deviceClasses": [
                            {
                                "objectCode": "270009",
                                "objectCodeExternal": "E-Bike"
                            }
                        ],
                        "documents": {
                            "legalDocuments": [
                                documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,
                                documentTypes.GENERAL_DATA_PROTECTION_REGULATION,
                                documentTypes.RIGHT_OF_WITHDRAWAL
                            ]
                        },
                        "advantages": [
                            "Verschleiß / Abnutzung / Alterung der Reifen und Schläuche (ab dem 7. Monat)",
                            "Materialfehler",
                            "Konstruktionsfehler",
                            "Produktionsfehler",
                            "Reparaturkosten",
                            "Unsachgemäße Handhabung",
                            "Vandalismus",
                            "Verschleiß am eBike / Pedelec (ab dem 07. Monat)",
                            "Verschleiß am Akku (ab dem 13. Monat)",
                            "Wasser-/Feuchtigkeitsschäden",
                            "Elektronikschäden",
                            "Fall- und Sturzschäden",
                            "Pick-up-Service",
                            "Akku-Defekte",
                            "Unfallschäden",
                            "Diebstahl des E-Bikes/Pedelecs",
                            "Teilediebstahl"
                        ],
                        "risks": []
                    }, {
                        "name": "E-Bike-Komplettschutz mit jährlicher Zahlweise",
                        "shortName": "Variante B",
                        "productType": "KOMPLETTSCHUTZ_EBIKE_J_2018",
                        "applicationCode": "GU WG DE RAD EBS 0818",
                        "basicRiskType": "KOMPLETTSCHUTZ_EBIKE",
                        "defaultPaymentInterval": "yearly",
                        "productImageLink": "productImageLink",
                        "backgroundStyle": "secondary",
                        "priceRanges": [
                            {
                                "minClose": 0,
                                "maxOpen": 150001
                            },
                            {
                                "minClose": 150001,
                                "maxOpen": 300001
                            },
                            {
                                "minClose": 300001,
                                "maxOpen": 400001
                            },
                            {
                                "minClose": 400001,
                                "maxOpen": 600000
                            }
                        ],
                        "lock": {
                            "priceRanges": [
                                {
                                    "minClose": 0,
                                    "maxOpen": 600001,
                                    "requiredLockPrice": 4900
                                }
                            ]
                        },
                        "deviceClasses": [
                            {
                                "objectCode": "270009",
                                "objectCodeExternal": "E-Bike",
                            }
                        ],
                        "documents": {
                            "legalDocuments": [
                                documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,
                                documentTypes.GENERAL_DATA_PROTECTION_REGULATION,
                                documentTypes.RIGHT_OF_WITHDRAWAL
                            ]
                        },
                        "advantages": [
                            "Materialfehler",
                            "Konstruktionsfehler",
                            "Produktionsfehler",
                            "Reparaturkosten",
                            "Unsachgemäße Handhabung",
                            "Vandalismus",
                            "Verschleiß am eBike / Pedelec (ab dem 07. Monat)",
                            "Verschleiß am Akku (ab dem 13. Monat)",
                            "Wasser-/Feuchtigkeitsschäden",
                            "Elektronikschäden",
                            "Fall- und Sturzschäden",
                            "Pick-up-Service",
                            "Akku-Defekte",
                            "Unfallschäden",
                            "Diebstahl des E-Bikes/Pedelecs",
                            "Teilediebstahl"
                        ],
                        "risks": []
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
        basicAuthUser: "testclient",
        basicAuthPassword: "testclient"
    }
};