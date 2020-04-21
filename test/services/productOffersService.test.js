const productOffersService = require('../../src/services/productOffersService');
const heimdallProductOffers = require('../../integration-test/controllers/heimdallResponses').getProductOffersResponse;

test("test webservices product offer conversion", async () => {
    process.env.BACKEND = "webservices";
    const clientConfig = {
        id: "clientId"
    };
    const mockProductOffersRepository = {
        findByClientId: () => productOffersResult
    };
    const result = await productOffersService.getProductOffers(clientConfig, "Smartphone", 80000, mockProductOffersRepository);

    expect(result).toEqual({
        "generalDocuments": [],
        "productOffers": [
            {
                "id": "9338a770-0d0d-4203-8d54-583a03bdebf3",
                "name": "Komplettschutz",
                "advantages": [
                    "Das schon toll hier",
                    "alles wird gut",
                    "Corona Party!!!"
                ],
                "defaultPaymentInterval": "monthly",
                "prices": {
                    "monthly": {
                        "price": 800,
                        "priceCurrency": "EUR",
                        "priceTax": 128
                    },
                    "quarterly": {
                        "price": 2400,
                        "priceCurrency": "EUR",
                        "priceTax": 383
                    },
                    "halfYearly": {
                        "price": 4800,
                        "priceCurrency": "EUR",
                        "priceTax": 766
                    },
                    "yearly": {
                        "price": 9600,
                        "priceCurrency": "EUR",
                        "priceTax": 1533
                    }
                },
                "documents": [
                    {
                        "uri": "http://localhost:3000/documents/da39a3ee5e6b4b0d3255bfef95601890afd80709",
                        "type": "LN",
                        "name": "GU WG DE KS 0419_RECHTSDOKUMENTE.PDF"
                    }
                ]
            },
            {
                "id": "bb91b2de-cbb9-49e8-a3a5-1b6e8296403d",
                "name": "Komplettschutz mit Premium-Option",
                "advantages": [
                    "total geiler diebstahlschutz",
                    "was gegen Wasser",
                    "mit Soße"
                ],
                "defaultPaymentInterval": "monthly",
                "prices": {
                    "monthly": {
                        "price": 995,
                        "priceCurrency": "EUR",
                        "priceTax": 159
                    },
                    "quarterly": {
                        "price": 2985,
                        "priceCurrency": "EUR",
                        "priceTax": 477
                    },
                    "halfYearly": {
                        "price": 5970,
                        "priceCurrency": "EUR",
                        "priceTax": 953
                    },
                    "yearly": {
                        "price": 11940,
                        "priceCurrency": "EUR",
                        "priceTax": 1906
                    }
                },
                "documents": [
                    {
                        "uri": "http://localhost:3000/documents/da39a3ee5e6b4b0d3255bfef95601890afd80709",
                        "type": "LN",
                        "name": "GU WG DE KS 0419_RECHTSDOKUMENTE.PDF"
                    }
                ]
            }
        ]
    })
});

test("test heimdall product offer conversion", async () => {
    process.env.BACKEND = "heimdall";
    const mockHeimdallClient = {
        getProductOffers: () => heimdallProductOffers.payload
    };
    const result = await productOffersService.getProductOffers({}, "Smartphone", 80000, undefined, mockHeimdallClient);
    expect(result).toEqual({
        "generalDocuments": [],
        "productOffers": [
            {
                "id": "1",
                "name": "Basis",
                "advantages": [
                    "Für private und berufliche Nutzung",
                    "Unsachgemäße Handhabung",
                    "Weltweiter Schutz",
                    "Volle Kostenübernahme bei Reparaturen",
                    "Bei Totalschaden zählt der Zeitwert",
                    "Für private und berufliche Nutzung",
                    "Weltweiter Schutz",
                    "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte",
                    "Unsachgemäße Handhabung"
                ],
                "defaultPaymentInterval": "monthly",
                "prices": {
                    "monthly": {
                        "price": 500,
                        "priceCurrency": "EUR",
                        "priceTax": 80
                    },
                    "quarterly": {
                        "price": 1500,
                        "priceCurrency": "EUR",
                        "priceTax": 239
                    },
                    "halfYearly": {
                        "price": 3000,
                        "priceCurrency": "EUR",
                        "priceTax": 479
                    },
                    "yearly": {
                        "price": 6000,
                        "priceCurrency": "EUR",
                        "priceTax": 958
                    }
                },
                "documents": [
                    {
                        "type": "LN",
                        "name": "Rechtsdokumente",
                        "uri": "https://heimdall-stg-04.wertgarantie.com/download/82e38762-4440-46a9-a34e-58974a3ddad5"
                    },
                    {
                        "type": "IPID",
                        "name": "Informationsblatt für Versicherungsprodukte",
                        "uri": "https://heimdall-stg-04.wertgarantie.com/download/1eb7d0ce-6c62-4264-a3e7-58319bd4d4d1"
                    },
                    {
                        "type": "POLICY",
                        "name": "Versicherungsschein",
                        "uri": "https://heimdall-stg-04.wertgarantie.com/download/e725f5d0-a72c-4d00-9063-81753f191150"
                    },
                    {
                        "type": "GDPR",
                        "name": "DSGVO Beileger",
                        "uri": "https://heimdall-stg-04.wertgarantie.com/download/334e5b9b-0fb5-4a45-859e-ad0267a4431e"
                    },
                    {
                        "type": "GTCI",
                        "name": "Allgemeine Versicherungsbedingungen",
                        "uri": "https://heimdall-stg-04.wertgarantie.com/download/9f1506a9-65e9-467c-a8d0-8f7ccd47d75b"
                    },
                    {
                        "type": "SEPA",
                        "name": "SEPA Lastschriftmandat",
                        "uri": "https://heimdall-stg-04.wertgarantie.com/download/2954d934-884d-46c5-81a9-11e9e5c8fb19"
                    },
                    {
                        "type": "PIS",
                        "name": "Produktinformationsblatt",
                        "uri": "https://heimdall-stg-04.wertgarantie.com/download/b190b136-5d4f-43a0-b9f2-f1dd23348448"
                    }
                ]
            }
        ]
    });
});

const productOffersResult = [
    {
        "id": "9338a770-0d0d-4203-8d54-583a03bdebf3",
        "name": "Komplettschutz",
        "risks": [],
        "defaultPaymentInterval": "monthly",
        "devices": [
            {
                "intervals": [
                    {
                        "description": "monatlich",
                        "intervalCode": "1",
                        "priceRangePremiums": [
                            {
                                "minClose": 0,
                                "maxOpen": 30001,
                                "insurancePremium": 500
                            },
                            {
                                "minClose": 30001,
                                "maxOpen": 80001,
                                "insurancePremium": 800
                            },
                            {
                                "minClose": 80001,
                                "maxOpen": 180001,
                                "insurancePremium": 1100
                            }
                        ]
                    },
                    {
                        "description": "vierteljährlich",
                        "intervalCode": "3",
                        "priceRangePremiums": [
                            {
                                "minClose": 0,
                                "maxOpen": 30001,
                                "insurancePremium": 1500
                            },
                            {
                                "minClose": 30001,
                                "maxOpen": 80001,
                                "insurancePremium": 2400
                            },
                            {
                                "minClose": 80001,
                                "maxOpen": 180001,
                                "insurancePremium": 3300
                            }
                        ]
                    },
                    {
                        "description": "halbjährlich",
                        "intervalCode": "6",
                        "priceRangePremiums": [
                            {
                                "minClose": 0,
                                "maxOpen": 30001,
                                "insurancePremium": 3000
                            },
                            {
                                "minClose": 30001,
                                "maxOpen": 80001,
                                "insurancePremium": 4800
                            },
                            {
                                "minClose": 80001,
                                "maxOpen": 180001,
                                "insurancePremium": 6600
                            }
                        ]
                    },
                    {
                        "description": "jährlich",
                        "intervalCode": "12",
                        "priceRangePremiums": [
                            {
                                "minClose": 0,
                                "maxOpen": 30001,
                                "insurancePremium": 6000
                            },
                            {
                                "minClose": 30001,
                                "maxOpen": 80001,
                                "insurancePremium": 9600
                            },
                            {
                                "minClose": 80001,
                                "maxOpen": 180001,
                                "insurancePremium": 13200
                            }
                        ]
                    }
                ],
                "objectCode": "9025",
                "maxPriceLimitation": 180000,
                "objectCodeExternal": "Smartphone"
            },
            {
                "intervals": [
                    {
                        "description": "monatlich",
                        "intervalCode": "1",
                        "priceRangePremiums": [
                            {
                                "minClose": 0,
                                "maxOpen": 30001,
                                "insurancePremium": 695
                            },
                            {
                                "minClose": 30001,
                                "maxOpen": 80001,
                                "insurancePremium": 995
                            },
                            {
                                "minClose": 80001,
                                "maxOpen": 180001,
                                "insurancePremium": 1295
                            }
                        ]
                    },
                    {
                        "description": "vierteljährlich",
                        "intervalCode": "3",
                        "priceRangePremiums": [
                            {
                                "minClose": 0,
                                "maxOpen": 30001,
                                "insurancePremium": 2085
                            },
                            {
                                "minClose": 30001,
                                "maxOpen": 80001,
                                "insurancePremium": 2985
                            },
                            {
                                "minClose": 80001,
                                "maxOpen": 180001,
                                "insurancePremium": 3885
                            }
                        ]
                    },
                    {
                        "description": "halbjährlich",
                        "intervalCode": "6",
                        "priceRangePremiums": [
                            {
                                "minClose": 0,
                                "maxOpen": 30001,
                                "insurancePremium": 4170
                            },
                            {
                                "minClose": 30001,
                                "maxOpen": 80001,
                                "insurancePremium": 5970
                            },
                            {
                                "minClose": 80001,
                                "maxOpen": 180001,
                                "insurancePremium": 7770
                            }
                        ]
                    },
                    {
                        "description": "jährlich",
                        "intervalCode": "12",
                        "priceRangePremiums": [
                            {
                                "minClose": 0,
                                "maxOpen": 30001,
                                "insurancePremium": 8340
                            },
                            {
                                "minClose": 30001,
                                "maxOpen": 80001,
                                "insurancePremium": 11940
                            },
                            {
                                "minClose": 80001,
                                "maxOpen": 180001,
                                "insurancePremium": 15540
                            }
                        ]
                    }
                ],
                "objectCode": "73",
                "maxPriceLimitation": 180000,
                "objectCodeExternal": "Mobilfunk"
            }
        ],
        "clientId": "fa5feab2-6c20-482d-b53f-9fb7bfffa955",
        "documents": [
            {
                "documentId": "da39a3ee5e6b4b0d3255bfef95601890afd80709",
                "documentType": "LN",
                "documentTitle": "GU WG DE KS 0419_RECHTSDOKUMENTE.PDF"
            }
        ],
        "advantages": [
            "Das schon toll hier",
            "alles wird gut",
            "Corona Party!!!"
        ],
        "productType": "KOMPLETTSCHUTZ_2019",
        "applicationCode": "GU WG DE KS 0419"
    },
    {
        "id": "bb91b2de-cbb9-49e8-a3a5-1b6e8296403d",
        "name": "Komplettschutz mit Premium-Option",
        "risks": [
            "DIEBSTAHLSCHUTZ"
        ],
        "defaultPaymentInterval": "monthly",
        "devices": [
            {
                "intervals": [
                    {
                        "description": "monatlich",
                        "intervalCode": "1",
                        "priceRangePremiums": [
                            {
                                "minClose": 0,
                                "maxOpen": 30001,
                                "insurancePremium": 695
                            },
                            {
                                "minClose": 30001,
                                "maxOpen": 80001,
                                "insurancePremium": 995
                            },
                            {
                                "minClose": 80001,
                                "maxOpen": 180001,
                                "insurancePremium": 1295
                            }
                        ]
                    },
                    {
                        "description": "vierteljährlich",
                        "intervalCode": "3",
                        "priceRangePremiums": [
                            {
                                "minClose": 0,
                                "maxOpen": 30001,
                                "insurancePremium": 2085
                            },
                            {
                                "minClose": 30001,
                                "maxOpen": 80001,
                                "insurancePremium": 2985
                            },
                            {
                                "minClose": 80001,
                                "maxOpen": 180001,
                                "insurancePremium": 3885
                            }
                        ]
                    },
                    {
                        "description": "halbjährlich",
                        "intervalCode": "6",
                        "priceRangePremiums": [
                            {
                                "minClose": 0,
                                "maxOpen": 30001,
                                "insurancePremium": 4170
                            },
                            {
                                "minClose": 30001,
                                "maxOpen": 80001,
                                "insurancePremium": 5970
                            },
                            {
                                "minClose": 80001,
                                "maxOpen": 180001,
                                "insurancePremium": 7770
                            }
                        ]
                    },
                    {
                        "description": "jährlich",
                        "intervalCode": "12",
                        "priceRangePremiums": [
                            {
                                "minClose": 0,
                                "maxOpen": 30001,
                                "insurancePremium": 8340
                            },
                            {
                                "minClose": 30001,
                                "maxOpen": 80001,
                                "insurancePremium": 11940
                            },
                            {
                                "minClose": 80001,
                                "maxOpen": 180001,
                                "insurancePremium": 15540
                            }
                        ]
                    }
                ],
                "objectCode": "9025",
                "maxPriceLimitation": 180000,
                "objectCodeExternal": "Smartphone"
            },
            {
                "intervals": [
                    {
                        "description": "monatlich",
                        "intervalCode": "1",
                        "priceRangePremiums": [
                            {
                                "maxOpen": 30000,
                                "minClose": 0,
                                "insurancePremium": 0
                            },
                            {
                                "maxOpen": 80000,
                                "minClose": 30000,
                                "insurancePremium": 0
                            },
                            {
                                "maxOpen": 180000,
                                "minClose": 80000,
                                "insurancePremium": 0
                            }
                        ]
                    },
                    {
                        "description": "vierteljährlich",
                        "intervalCode": "3",
                        "priceRangePremiums": [
                            {
                                "maxOpen": 30000,
                                "minClose": 0,
                                "insurancePremium": 0
                            },
                            {
                                "maxOpen": 80000,
                                "minClose": 30000,
                                "insurancePremium": 0
                            },
                            {
                                "maxOpen": 180000,
                                "minClose": 80000,
                                "insurancePremium": 0
                            }
                        ]
                    },
                    {
                        "description": "halbjährlich",
                        "intervalCode": "6",
                        "priceRangePremiums": [
                            {
                                "maxOpen": 30000,
                                "minClose": 0,
                                "insurancePremium": 0
                            },
                            {
                                "maxOpen": 80000,
                                "minClose": 30000,
                                "insurancePremium": 0
                            },
                            {
                                "maxOpen": 180000,
                                "minClose": 80000,
                                "insurancePremium": 0
                            }
                        ]
                    },
                    {
                        "description": "jährlich",
                        "intervalCode": "12",
                        "priceRangePremiums": [
                            {
                                "maxOpen": 30000,
                                "minClose": 0,
                                "insurancePremium": 0
                            },
                            {
                                "maxOpen": 80000,
                                "minClose": 30000,
                                "insurancePremium": 0
                            },
                            {
                                "maxOpen": 180000,
                                "minClose": 80000,
                                "insurancePremium": 0
                            }
                        ]
                    }
                ],
                "objectCode": "73",
                "maxPriceLimitation": 180000,
                "objectCodeExternal": "Mobilfunk"
            }
        ],
        "clientId": "fa5feab2-6c20-482d-b53f-9fb7bfffa955",
        "documents": [
            {
                "documentId": "da39a3ee5e6b4b0d3255bfef95601890afd80709",
                "documentType": "LN",
                "documentTitle": "GU WG DE KS 0419_RECHTSDOKUMENTE.PDF"
            }
        ],
        "advantages": [
            "total geiler diebstahlschutz",
            "was gegen Wasser",
            "mit Soße"
        ],
        "productType": "KOMPLETTSCHUTZ_2019",
        "applicationCode": "GU WG DE KS 0419"
    }
];