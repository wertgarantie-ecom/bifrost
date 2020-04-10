const webservicesResponses = require('../../integration-test/services/webservicesResponses');
const webservicesService = require('../../src/services/webservicesService');
const fixtureHelper = require('../../integration-test/helper/fixtureHelper');
const documentTypes = require('../../src/services/documentTypes').documentTypes;
const _ = require('lodash');

const session = 'DG21586374946XD38P9X37K64BD3NI1L78XD9GR93B33E3N34CO456R26KL2DE5';
const testClientConfig = fixtureHelper.createDefaultClientWithWebservicesConfiguration();
const mockWebservicesClient = {
    getLegalDocuments: () => webservicesResponses.multipleLegalDocuments,
    getComparisonDocuments: () => webservicesResponses.multipleComparisonDocumentsResponse,
    login: () => session,
    getAgentData: () => {
        const agentData = _.cloneDeep(webservicesResponses.agentDataMultipleProducts);
        agentData.RESULT.PRODUCT_LIST.PRODUCT.map(product => {
            if (!Array.isArray(product.PAYMENTINTERVALS.INTERVAL)) {
                product.PAYMENTINTERVALS.INTERVAL = [product.PAYMENTINTERVALS.INTERVAL];
            }
        });
        return agentData;
    },
    getInsurancePremium: () => webservicesResponses.insurancePremiumResponse
};

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
        documentTypes: {
            comparisonDocuments: [
                {
                    type: documentTypes.COMPARISON,
                    pattern: 'EX NEO DGG WG DE P3 0917_RECHTSDOKUMENTE.PDF'
                }
            ]
        }
    };

    const documentRepository = {
        persistDocument: () => "comparisonDocumentID"
    };

    const result = await webservicesService.getComparisonDocuments(session, productOfferConfig, mockWebservicesClient, documentRepository);
    expect(result.length).toBe(1);
    expect(result[0].document_title).toEqual("EX NEO DGG WG DE P3 0917_RECHTSDOKUMENTE.PDF");
    expect(result[0].document_type).toEqual(documentTypes.COMPARISON);
    expect(result[0].document_id).toEqual("comparisonDocumentID");
});

test('should not have comparison documents if not configured', async () => {
    const productOfferConfig = {
        documentTypes: {
            comparisonDocuments: []
        }
    };

    const documentRepository = {
        persistDocument: () => "comparisonDocumentID"
    };

    const result = await webservicesService.getComparisonDocuments(session, productOfferConfig, mockWebservicesClient, documentRepository);
    expect(result.length).toBe(0);
});

test('should getLegalDocuments', async () => {
    const productOfferConfig = {
        documentTypes: {
            legalDocuments: [
                {
                    type: documentTypes.LEGAL_NOTICE,
                    pattern: 'GU WG DE KS 0419_RECHTSDOKUMENTE.PDF'
                }
            ],
        }
    };

    const documentRepository = {
        persistDocument: () => "legalDocumentID"
    };

    const result = await webservicesService.getLegalDocuments(session, productOfferConfig, mockWebservicesClient, documentRepository);
    expect(result.length).toBe(1);
    expect(result[0].document_title).toEqual("GU WG DE KS 0419_RECHTSDOKUMENTE.PDF");
    expect(result[0].document_type).toEqual(documentTypes.LEGAL_NOTICE);
    expect(result[0].document_id).toEqual("legalDocumentID");
});

test('should getDocuments', async () => {
    const productOfferConfig = {
        applicationCode: "GU WG DE KS 0419",
        productType: "KOMPLETTSCHUTZ_2019",
        documentTypes: {
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
        persistDocument: () => "legalDocumentID"
    };
    const result = await webservicesService.getDocuments(session, productOfferConfig, mockWebservicesClient, documentRepository);
    expect(result.length).toBe(1);
    expect(result[0].document_title).toEqual("GU WG DE KS 0419_RECHTSDOKUMENTE.PDF");
    expect(result[0].document_type).toEqual(documentTypes.LEGAL_NOTICE);
    expect(result[0].document_id).toEqual("legalDocumentID");
});

test('should findMaxPriceForDeviceClass', async () => {
    const deviceClassConfig = {
        objectCode: "9025",
        externalObjectCode: "Smartphone",
        priceRanges: [
            {
                min: 0,
                max: 300
            },
            {
                min: 300,
                max: 800
            },
            {
                min: 800,
                max: 1800
            }
        ]
    };
    const webservicesProduct = webservicesResponses.agentDataSingleProduct.RESULT.PRODUCT_LIST.PRODUCT;
    const result = await webservicesService.findMaxPriceForDeviceClass(webservicesProduct, deviceClassConfig);
    expect(result).toBe("1800");
});

test('should getIntervalPremiumsForPriceRanges', async () => {
    const deviceClassConfig = {
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
    };
    const webservicesProduct = webservicesResponses.agentDataSingleProduct.RESULT.PRODUCT_LIST.PRODUCT
    const result = await webservicesService.getIntervalPremiumsForPriceRanges(session, webservicesProduct, deviceClassConfig, "GU WG DE KS 0419", "KOMPLETTSCHUTZ_2019", ["KOMPLETTSCHUTZ"], mockWebservicesClient);
    expect(result.length).toBe(4);
    expect(result[0]).toEqual({
        "intervalCode": "1",
        "description": "monatlich",
        "priceRangePremiums": [
            {
                "minClose": 0,
                "maxOpen": 300,
                "insurancePremium": "23,4"
            },
            {
                "minClose": 300,
                "maxOpen": 800,
                "insurancePremium": "23,4"
            },
            {
                "minClose": 800,
                "maxOpen": 1800,
                "insurancePremium": "23,4"
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
        risks: ["DIEBSTAHLSCHUTZ"]
    };
    const webservicesProduct = webservicesResponses.agentDataSingleProduct.RESULT.PRODUCT_LIST.PRODUCT
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
                        min: 0,
                        max: 300
                    },
                    {
                        min: 300,
                        max: 800
                    },
                    {
                        min: 800,
                        max: 1800
                    }]
            },
            {
                objectCode: "73",
                objectCodeExternal: "Mobilfunk",
                priceRanges: [
                    {
                        min: 0,
                        max: 300
                    },
                    {
                        min: 300,
                        max: 800
                    },
                    {
                        min: 800,
                        max: 1800
                    }]
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
    };

    const result = await webservicesService.assembleProductOffers(session, productOfferConfig, "public:publicId", webservicesResponses.agentDataMultipleProducts.RESULT.PRODUCT_LIST.PRODUCT, mockWebservicesClient);
    console.log(JSON.stringify(result, null, 2));
});

// big big one
test('should assembleAllProductOffers', async () => {
    const result = await webservicesService.assembleAllProductOffers(testClientConfig, mockWebservicesClient);
    console.log(JSON.stringify(result, null, 2));
});

const expectedIntervalPremiumsForKS = [
    {
        "objectCode": "9025",
        "objectCodeExternal": "Smartphone",
        "maxPriceLimitation": "1800",
        "intervals": [
            {
                "intervalCode": "1",
                "description": "monatlich",
                "priceRangePremiums": [
                    {
                        "minClose": 0,
                        "maxOpen": 300,
                        "insurancePremium": "23,4"
                    },
                    {
                        "minClose": 300,
                        "maxOpen": 800,
                        "insurancePremium": "23,4"
                    },
                    {
                        "minClose": 800,
                        "maxOpen": 1800,
                        "insurancePremium": "23,4"
                    }
                ]
            },
            {
                "intervalCode": "3",
                "description": "vierteljährlich",
                "priceRangePremiums": [
                    {
                        "minClose": 0,
                        "maxOpen": 300,
                        "insurancePremium": "23,4"
                    },
                    {
                        "minClose": 300,
                        "maxOpen": 800,
                        "insurancePremium": "23,4"
                    },
                    {
                        "minClose": 800,
                        "maxOpen": 1800,
                        "insurancePremium": "23,4"
                    }
                ]
            },
            {
                "intervalCode": "6",
                "description": "halbjährlich",
                "priceRangePremiums": [
                    {
                        "minClose": 0,
                        "maxOpen": 300,
                        "insurancePremium": "23,4"
                    },
                    {
                        "minClose": 300,
                        "maxOpen": 800,
                        "insurancePremium": "23,4"
                    },
                    {
                        "minClose": 800,
                        "maxOpen": 1800,
                        "insurancePremium": "23,4"
                    }
                ]
            },
            {
                "intervalCode": "12",
                "description": "jährlich",
                "priceRangePremiums": [
                    {
                        "minClose": 0,
                        "maxOpen": 300,
                        "insurancePremium": "23,4"
                    },
                    {
                        "minClose": 300,
                        "maxOpen": 800,
                        "insurancePremium": "23,4"
                    },
                    {
                        "minClose": 800,
                        "maxOpen": 1800,
                        "insurancePremium": "23,4"
                    }
                ]
            }
        ]
    },
    {
        "objectCode": "73",
        "objectCodeExternal": "Mobilfunk",
        "maxPriceLimitation": "1800",
        "intervals": [
            {
                "intervalCode": "1",
                "description": "monatlich",
                "priceRangePremiums": [
                    {
                        "minClose": 0,
                        "maxOpen": 300,
                        "insurancePremium": "23,4"
                    },
                    {
                        "minClose": 300,
                        "maxOpen": 800,
                        "insurancePremium": "23,4"
                    },
                    {
                        "minClose": 800,
                        "maxOpen": 1800,
                        "insurancePremium": "23,4"
                    }
                ]
            },
            {
                "intervalCode": "3",
                "description": "vierteljährlich",
                "priceRangePremiums": [
                    {
                        "minClose": 0,
                        "maxOpen": 300,
                        "insurancePremium": "23,4"
                    },
                    {
                        "minClose": 300,
                        "maxOpen": 800,
                        "insurancePremium": "23,4"
                    },
                    {
                        "minClose": 800,
                        "maxOpen": 1800,
                        "insurancePremium": "23,4"
                    }
                ]
            },
            {
                "intervalCode": "6",
                "description": "halbjährlich",
                "priceRangePremiums": [
                    {
                        "minClose": 0,
                        "maxOpen": 300,
                        "insurancePremium": "23,4"
                    },
                    {
                        "minClose": 300,
                        "maxOpen": 800,
                        "insurancePremium": "23,4"
                    },
                    {
                        "minClose": 800,
                        "maxOpen": 1800,
                        "insurancePremium": "23,4"
                    }
                ]
            },
            {
                "intervalCode": "12",
                "description": "jährlich",
                "priceRangePremiums": [
                    {
                        "minClose": 0,
                        "maxOpen": 300,
                        "insurancePremium": "23,4"
                    },
                    {
                        "minClose": 300,
                        "maxOpen": 800,
                        "insurancePremium": "23,4"
                    },
                    {
                        "minClose": 800,
                        "maxOpen": 1800,
                        "insurancePremium": "23,4"
                    }
                ]
            }
        ]
    }
];