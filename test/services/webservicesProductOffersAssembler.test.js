const webservicesResponses = require('../../integration-test/services/webservicesResponses');
const webservicesService = require('../../src/services/webservicesProductOffersAssembler');
const fixtureHelper = require('../../integration-test/helper/fixtureHelper');
const documentTypes = require('../../src/services/documentTypes').documentTypes;
const uuid = require('uuid');

const session = 'DG21586374946XD38P9X37K64BD3NI1L78XD9GR93B33E3N34CO456R26KL2DE5';
const mockWebservicesClient = require('../helpers/webserviceMockClient').createMockWebserviceClient(session);

const allRelevantWebservicesProducts = [{
    "RISKS": {
        "RISK": {
            "RISK_NAME": "Diebstahlschutz",
            "RISK_TYPE": "DIEBSTAHLSCHUTZ"
        }
    },
    "APPLICATION_CODE": "GU WG DE KS 0419",
    "SIGNATURES": "1",
    "PURCHASE_PRICE_LIMITATIONS": {
        "MAX_PRICE": [
            {
                "OBJECT_DESCRIPTION": "Mobilfunk",
                "AMOUNT": "1800",
                "OBJECT_CODE": "73"
            },
            {
                "OBJECT_DESCRIPTION": "Smartphone",
                "AMOUNT": "1800",
                "OBJECT_CODE": "9025"
            },
            {
                "AMOUNT": "10000",
                "OBJECT_CODE": {}
            }
        ]
    },
    "PRODUCT_TYPE": "KOMPLETTSCHUTZ_2019",
    "PRODUCT_NAME": "Komplettschutz 2019",
    "COLLECTIONTYPES": {
        "Einzug": "true",
        "Selbstzahler": "true"
    },
    "TERM": "langfristig",
    "MAX_DEVICES_EACH_CONTRACT": "3",
    "PAYMENTINTERVALS": {
        "INTERVAL": [
            {
                "VALUE": "1",
                "DESCRIPTION": "monatlich"
            },
            {
                "VALUE": "3",
                "DESCRIPTION": "vierteljährlich"
            },
            {
                "VALUE": "6",
                "DESCRIPTION": "halbjährlich"
            },
            {
                "VALUE": "12",
                "DESCRIPTION": "jährlich"
            }
        ]
    },
    "SIGANATURES": "1"
}];

test('should selectRelevantWertgarantieProducts', async () => {
    const clientConfig = {
        productOffersConfigurations: [
            {
                applicationCode: "GU WG DE KS 0419",
                productType: "KOMPLETTSCHUTZ_2019"
            }
        ]
    };
    const result = await webservicesService.selectRelevantWebservicesProducts(session, clientConfig, mockWebservicesClient);
    expect(result).toEqual(allRelevantWebservicesProducts);
});

test('should find product for client product offer config', async () => {
    const productOffersConfigurations = {
        applicationCode: "GU WG DE KS 0419",
        productType: "KOMPLETTSCHUTZ_2019"
    };
    const result = await webservicesService.findProductFor(productOffersConfigurations, allRelevantWebservicesProducts);
    expect(result).toEqual(allRelevantWebservicesProducts[0]);
});

test('should getComparisonDocuments', async () => {
    const productOfferConfig = {
        documents: {
            comparisonDocuments: [
                {
                    type: documentTypes.COMPARISON,
                    pattern: 'EX NEO DGG WG DE P3 0917_RECHTSDOKUMENTE.PDF'
                }
            ]
        }
    };

    const documentRepository = {
        persist: () => "comparisonDocumentID"
    };

    const result = await webservicesService.getComparisonDocuments(session, productOfferConfig, mockWebservicesClient, documentRepository);
    expect(result.length).toBe(1);
    expect(result[0].documentTitle).toEqual("EX NEO DGG WG DE P3 0917_RECHTSDOKUMENTE.PDF");
    expect(result[0].documentType).toEqual(documentTypes.COMPARISON);
    expect(result[0].documentId).toEqual("comparisonDocumentID");
});

test('should not have comparison documents if not configured', async () => {
    const productOfferConfig = {
        documents: {
            comparisonDocuments: []
        }
    };

    const documentRepository = {
        persist: () => "comparisonDocumentID"
    };

    const result = await webservicesService.getComparisonDocuments(session, productOfferConfig, mockWebservicesClient, documentRepository);
    expect(result.length).toBe(0);
});

test('should getLegalDocuments', async () => {
    const productOfferConfig = {
        documents: {
            legalDocuments: [
                {
                    type: documentTypes.LEGAL_NOTICE,
                    pattern: 'GU WG DE KS 0419_RECHTSDOKUMENTE.PDF'
                }
            ],
        }
    };

    const documentRepository = {
        persist: () => "legalDocumentID"
    };

    const result = await webservicesService.getLegalDocuments(session, productOfferConfig, mockWebservicesClient, documentRepository);
    expect(result.length).toBe(1);
    expect(result[0].documentTitle).toEqual("GU WG DE KS 0419_RECHTSDOKUMENTE.PDF");
    expect(result[0].documentType).toEqual(documentTypes.LEGAL_NOTICE);
    expect(result[0].documentId).toEqual("legalDocumentID");
});

test('should getDocuments', async () => {
    const productOfferConfig = {
        applicationCode: "GU WG DE KS 0419",
        productType: "KOMPLETTSCHUTZ_2019",
        documents: {
            legalDocuments: [
                {
                    type: documentTypes.LEGAL_NOTICE,
                    pattern: 'GU WG DE KS 0419_RECHTSDOKUMENTE.PDF'
                }
            ],
            comparisonDocuments: []
        }
    };
    const documentRepository = {
        persist: () => "legalDocumentID"
    };
    const result = await webservicesService.getDocuments(session, productOfferConfig, mockWebservicesClient, documentRepository);
    expect(result.length).toBe(1);
    expect(result[0].documentTitle).toEqual("GU WG DE KS 0419_RECHTSDOKUMENTE.PDF");
    expect(result[0].documentType).toEqual(documentTypes.LEGAL_NOTICE);
    expect(result[0].documentId).toEqual("legalDocumentID");
});

test('should findMaxPriceForDeviceClass', async () => {
    const deviceClassConfig = {
        objectCode: "9025",
        externalObjectCode: "Smartphone",
        priceRanges: [
            {
                min: 0,
                max: 30000
            },
            {
                min: 30000,
                max: 80000
            },
            {
                min: 80000,
                max: 180000
            }
        ]
    };
    const webservicesProduct = webservicesResponses.agentDataSingleProduct.RESULT.PRODUCT_LIST.PRODUCT;
    const result = await webservicesService.findMaxPriceForDeviceClass(webservicesProduct, deviceClassConfig);
    expect(result).toBe(180000);
});

test('should getIntervalPremiumsForPriceRanges', async () => {
    const deviceClassConfig = {
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
    };
    const webservicesProduct = webservicesResponses.agentDataSingleProduct.RESULT.PRODUCT_LIST.PRODUCT;
    const result = await webservicesService.getIntervalPremiumsForPriceRanges(session, webservicesProduct, deviceClassConfig, "GU WG DE KS 0419", "KOMPLETTSCHUTZ_2019", ["KOMPLETTSCHUTZ"], mockWebservicesClient);
    expect(result.length).toBe(4);
    expect(result[0]).toEqual({
        "intervalCode": "1",
        "description": "monatlich",
        "priceRangePremiums": [
            {
                "minClose": 0,
                "maxOpen": 30000,
                "insurancePremium": 2340
            },
            {
                "minClose": 30000,
                "maxOpen": 80000,
                "insurancePremium": 2340
            },
            {
                "minClose": 80000,
                "maxOpen": 180000,
                "insurancePremium": 2340
            }
        ]
    });
    expect(result[1].intervalCode).toEqual("3");
    expect(result[1].description).toEqual("vierteljährlich");
});

test('should getDevicePremiums', async () => {
    const productOfferConfig = {
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
        risks: ["DIEBSTAHLSCHUTZ"]
    };
    const webservicesProduct = webservicesResponses.agentDataSingleProduct.RESULT.PRODUCT_LIST.PRODUCT;
    const result = await webservicesService.getDevicePremiums(session, productOfferConfig, webservicesProduct, mockWebservicesClient);
    expect(result).toEqual(expectedIntervalPremiumsForKS);
});


// small big one
test('should assemble product offers for client', async () => {
    const productOfferConfig = {
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
    };

    const uuid = () => "productOfferUuid";
    const documentId = 1234;
    const documentRepository = {
        persist: () => documentId
    };
    const result = await webservicesService.assembleProductOffer(session, productOfferConfig, "public:publicId", webservicesResponses.agentDataMultipleProducts.RESULT.PRODUCT_LIST.PRODUCT, uuid, mockWebservicesClient, documentRepository);
    expect(result).toEqual({
        name: "Komplettschutz",
        id: "productOfferUuid",
        clientId: "public:publicId",
        applicationCode: productOfferConfig.applicationCode,
        productType: productOfferConfig.productType,
        risks: productOfferConfig.risks,
        documents: [
            {
                documentId: documentId,
                documentTitle: "GU WG DE KS 0419_RECHTSDOKUMENTE.PDF",
                documentType: "LN"
            }
        ],
        advantages: [],
        devices: [expectedIntervalPremiumsForKS[0]]
    });
});

test('should update all product offers for client', async () => {
    const mockDocumentRepo = {
        persist: () => "1234"
    };
    const clientConfig = fixtureHelper.createDefaultClientWithWebservicesConfiguration();
    const mockProductOfferRepo = {
        persist: productOffers => productOffers
    };
    const uuid = () => "f3125c49-5c7b-41b8-acfe-2dffe91cc3dd";
    const result = await webservicesService.updateAllProductOffersForClient(clientConfig, uuid, mockWebservicesClient, mockProductOfferRepo, mockDocumentRepo);
    expect(result).toEqual([
        {
            name: "Komplettschutz",
            id: "f3125c49-5c7b-41b8-acfe-2dffe91cc3dd",
            clientId: "testClientId",
            applicationCode: "GU WG DE KS 0419",
            productType: "KOMPLETTSCHUTZ_2019",
            defaultPaymentInterval: "monthly",
            risks: [],
            documents: [
                {
                    documentId: "1234",
                    documentTitle: "GU WG DE KS 0419_RECHTSDOKUMENTE.PDF",
                    documentType: "LN"
                }
            ],
            advantages: [],
            devices: expectedIntervalPremiumsForKS
        },
        {
            name: "Komplettschutz mit Premium-Option",
            id: "f3125c49-5c7b-41b8-acfe-2dffe91cc3dd",
            clientId: "testClientId",
            applicationCode: "GU WG DE KS 0419",
            productType: "KOMPLETTSCHUTZ_2019",
            defaultPaymentInterval: "monthly",
            risks: ["DIEBSTAHLSCHUTZ"],
            documents: [
                {
                    documentId: "1234",
                    documentTitle: "GU WG DE KS 0419_RECHTSDOKUMENTE.PDF",
                    documentType: "LN"
                }
            ],
            advantages: [],
            devices: expectedIntervalPremiumsForKS
        }
    ])
});

const expectedIntervalPremiumsForKS = [
    {
        "objectCode": "9025",
        "objectCodeExternal": "Smartphone",
        "maxPriceLimitation": 180000,
        "intervals": [
            {
                "intervalCode": "1",
                "description": "monatlich",
                "priceRangePremiums": [
                    {
                        "minClose": 0,
                        "maxOpen": 30000,
                        "insurancePremium": 2340
                    },
                    {
                        "minClose": 30000,
                        "maxOpen": 80000,
                        "insurancePremium": 2340
                    },
                    {
                        "minClose": 80000,
                        "maxOpen": 180000,
                        "insurancePremium": 2340
                    }
                ]
            },
            {
                "intervalCode": "3",
                "description": "vierteljährlich",
                "priceRangePremiums": [
                    {
                        "minClose": 0,
                        "maxOpen": 30000,
                        "insurancePremium": 2340
                    },
                    {
                        "minClose": 30000,
                        "maxOpen": 80000,
                        "insurancePremium": 2340
                    },
                    {
                        "minClose": 80000,
                        "maxOpen": 180000,
                        "insurancePremium": 2340
                    }
                ]
            },
            {
                "intervalCode": "6",
                "description": "halbjährlich",
                "priceRangePremiums": [
                    {
                        "minClose": 0,
                        "maxOpen": 30000,
                        "insurancePremium": 2340
                    },
                    {
                        "minClose": 30000,
                        "maxOpen": 80000,
                        "insurancePremium": 2340
                    },
                    {
                        "minClose": 80000,
                        "maxOpen": 180000,
                        "insurancePremium": 2340
                    }
                ]
            },
            {
                "intervalCode": "12",
                "description": "jährlich",
                "priceRangePremiums": [
                    {
                        "minClose": 0,
                        "maxOpen": 30000,
                        "insurancePremium": 2340
                    },
                    {
                        "minClose": 30000,
                        "maxOpen": 80000,
                        "insurancePremium": 2340
                    },
                    {
                        "minClose": 80000,
                        "maxOpen": 180000,
                        "insurancePremium": 2340
                    }
                ]
            }
        ]
    },
    {
        "objectCode": "73",
        "objectCodeExternal": "Mobilfunk",
        "maxPriceLimitation": 180000,
        "intervals": [
            {
                "intervalCode": "1",
                "description": "monatlich",
                "priceRangePremiums": [
                    {
                        "minClose": 0,
                        "maxOpen": 30000,
                        "insurancePremium": 2340
                    },
                    {
                        "minClose": 30000,
                        "maxOpen": 80000,
                        "insurancePremium": 2340
                    },
                    {
                        "minClose": 80000,
                        "maxOpen": 180000,
                        "insurancePremium": 2340
                    }
                ]
            },
            {
                "intervalCode": "3",
                "description": "vierteljährlich",
                "priceRangePremiums": [
                    {
                        "minClose": 0,
                        "maxOpen": 30000,
                        "insurancePremium": 2340
                    },
                    {
                        "minClose": 30000,
                        "maxOpen": 80000,
                        "insurancePremium": 2340
                    },
                    {
                        "minClose": 80000,
                        "maxOpen": 180000,
                        "insurancePremium": 2340
                    }
                ]
            },
            {
                "intervalCode": "6",
                "description": "halbjährlich",
                "priceRangePremiums": [
                    {
                        "minClose": 0,
                        "maxOpen": 30000,
                        "insurancePremium": 2340
                    },
                    {
                        "minClose": 30000,
                        "maxOpen": 80000,
                        "insurancePremium": 2340
                    },
                    {
                        "minClose": 80000,
                        "maxOpen": 180000,
                        "insurancePremium": 2340
                    }
                ]
            },
            {
                "intervalCode": "12",
                "description": "jährlich",
                "priceRangePremiums": [
                    {
                        "minClose": 0,
                        "maxOpen": 30000,
                        "insurancePremium": 2340
                    },
                    {
                        "minClose": 30000,
                        "maxOpen": 80000,
                        "insurancePremium": 2340
                    },
                    {
                        "minClose": 80000,
                        "maxOpen": 180000,
                        "insurancePremium": 2340
                    }
                ]
            }
        ]
    }
];

test('should not fail for client configs without product offer configuration', async () => {
    const clientWithoutProductOfferConfiguration = fixtureHelper.createDefaultClient();
    const result = await webservicesService.updateAllProductOffersForClient(clientWithoutProductOfferConfiguration);

    expect(result).toEqual(undefined);
});

test('should not fail if no products are matching for the given offers configuration', async () => {

    const clientConfig = {
        "id": "99d98769-2b76-43c2-915e-534ee141de9a",
        "name": "handyflash",
        "heimdallClientId": "0831cc8d-f5b8-4cfc-9c6c-6a08248348f2",
        "webservices": {},
        "activePartnerNumber": "1400689",
        "secrets": [
            "secret:9b94e0da-75a3-11ea-829c-9f33247ea535"
        ],
        "publicClientIds": [
            "public:9fc8764e-75a3-11ea-a64e-0b231b5109b9"
        ],
        productOffersConfigurations: [
            {
                name: "Komplettschutz",
                productType: "KOMPLETTSCHUTZ_2019",
                applicationCode: "this makes no sense",
                basicRiskType: "KOMPLETTSCHUTZ",
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
            }
        ]
    };

    const productOfferRepository = {
        persist: (productOffers) => productOffers
    };
    const result = await webservicesService.updateAllProductOffersForClient(clientConfig, undefined, mockWebservicesClient, productOfferRepository);

    expect(result).toEqual([]);
});

test.skip('call webservices dev', async () => {
    const clientConfig = {
        "id": uuid(),
        "name": "handyflash",
        "heimdallClientId": "0831cc8d-f5b8-4cfc-9c6c-6a08248348f2",
        "webservices": {
            username: "test-phone-user",
            password: "test-phone-password"
        },
        "activePartnerNumber": "1400689",
        "secrets": [
            "secret:" + uuid()
        ],
        "publicClientIds": [
            "public:" + uuid()
        ],
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
                advantages: ["Das schon toll hier", "alles wird gut", "Corona Party!!!"],
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
                advantages: ["total geiler diebstahlschutz", "was gegen Wasser", "mit Soße"],
                risks: ["DIEBSTAHLSCHUTZ"]
            }
        ]
    };
    process.env.DATABASE_URL = "postgresql://admin:bifrost@localhost:5432/bifrost";
    const client = await require('../../src/repositories/ClientRepository').persist(clientConfig);
    process.env.WEBSERVICES_URI = "http://localhost:3001/webservices";
    const offers = await webservicesService.updateAllProductOffersForClient(client);
    console.log(JSON.stringify(offers, null, 2));
}, 60000);

