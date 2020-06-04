const productOffersService = require('../../src/productoffers/productOffersService');
const heimdallProductOffers = require('../../integration-test/backends/heimdall/heimdallResponses').getProductOffersResponse;

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
                        "netAmount": 800,
                        "currency": "EUR",
                        "taxAmount": 128
                    },
                    "quarterly": {
                        "netAmount": 2400,
                        "currency": "EUR",
                        "taxAmount": 383
                    },
                    "halfYearly": {
                        "netAmount": 4800,
                        "currency": "EUR",
                        "taxAmount": 766
                    },
                    "yearly": {
                        "netAmount": 9600,
                        "currency": "EUR",
                        "taxAmount": 1533
                    }
                },
                "documents": [
                    {
                        "uri": "http://localhost:3000/wertgarantie/documents/da39a3ee5e6b4b0d3255bfef95601890afd80709",
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
                        "netAmount": 995,
                        "currency": "EUR",
                        "taxAmount": 159
                    },
                    "quarterly": {
                        "netAmount": 2985,
                        "currency": "EUR",
                        "taxAmount": 477
                    },
                    "halfYearly": {
                        "netAmount": 5970,
                        "currency": "EUR",
                        "taxAmount": 953
                    },
                    "yearly": {
                        "netAmount": 11940,
                        "currency": "EUR",
                        "taxAmount": 1906
                    }
                },
                "documents": [
                    {
                        "uri": "http://localhost:3000/wertgarantie/documents/da39a3ee5e6b4b0d3255bfef95601890afd80709",
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
                        "netAmount": 500,
                        "currency": "EUR",
                        "taxAmount": 80
                    },
                    "quarterly": {
                        "netAmount": 1500,
                        "currency": "EUR",
                        "taxAmount": 239
                    },
                    "halfYearly": {
                        "netAmount": 3000,
                        "currency": "EUR",
                        "taxAmount": 479
                    },
                    "yearly": {
                        "netAmount": 6000,
                        "currency": "EUR",
                        "taxAmount": 958
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
            },
            {
                "id": "2",
                "name": "Premium",
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
                        "netAmount": 500,
                        "currency": "EUR",
                        "taxAmount": 80
                    },
                    "quarterly": {
                        "netAmount": 1500,
                        "currency": "EUR",
                        "taxAmount": 239
                    },
                    "halfYearly": {
                        "netAmount": 3000,
                        "currency": "EUR",
                        "taxAmount": 479
                    },
                    "yearly": {
                        "netAmount": 6000,
                        "currency": "EUR",
                        "taxAmount": 958
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

test("should get correct required lock price for bike", () => {
    const productOffer = {
        "lock": {
            "priceRanges": [
                {
                    "maxOpen": 100001,
                    "minClose": 0,
                    "requiredLockPrice": 1900
                },
                {
                    "maxOpen": 400001,
                    "minClose": 100001,
                    "requiredLockPrice": 4900
                }
            ]
        }
    };
    const requiredLockPrice19 = productOffersService.getMinimumLockPriceForProduct(productOffer, 100000);
    expect(requiredLockPrice19).toEqual(1900);
    const requiredLockPrice49 = productOffersService.getMinimumLockPriceForProduct(productOffer, 100001);
    expect(requiredLockPrice49).toEqual(4900);
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