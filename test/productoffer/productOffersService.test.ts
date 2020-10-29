const productOffersService = require('../../src/productoffers/productOffersService');
import Condition from '../../src/productoffers/productConditions';

const {NEW, UNKNOWN} = Condition;

test("test webservices product offer conversion", async () => {
    process.env.BACKEND = "webservices";
    const clientConfig = {
        id: "clientId"
    };
    const mockProductOffersRepository = {
        findByClientId: () => productOffersResult
    };
    const result = await productOffersService.getProductOffers(clientConfig, ["Kühlschrank", "Smartphone", "ein ponny"], 80000, undefined, undefined, mockProductOffersRepository);

    expect(result).toEqual(
        [
            {
                "advantages": [
                    "Das schon toll hier",
                    "alles wird gut",
                    "Corona Party!!!"
                ],
                "defaultPaymentInterval": "monthly",
                "deviceClass": "9025",
                "documents": [
                    {
                        "name": "GU WG DE KS 0419_RECHTSDOKUMENTE.PDF",
                        "type": "LN",
                        "uri": "http://localhost:3000/wertgarantie/documents/da39a3ee5e6b4b0d3255bfef95601890afd80709"
                    }
                ],
                "id": "9338a770-0d0d-4203-8d54-583a03bdebf3",
                "name": "Komplettschutz",
                "priceRange": {
                    "maxOpen": 80001,
                    "minClose": 30001
                },
                "prices": {
                    "halfYearly": {
                        "currency": "EUR",
                        "netAmount": 4800,
                        "taxAmount": 766
                    },
                    "monthly": {
                        "currency": "EUR",
                        "netAmount": 800,
                        "taxAmount": 128
                    },
                    "quarterly": {
                        "currency": "EUR",
                        "netAmount": 2400,
                        "taxAmount": 383
                    },
                    "yearly": {
                        "currency": "EUR",
                        "netAmount": 9600,
                        "taxAmount": 1533
                    }
                },
                "shopDeviceClass": "Smartphone"
            },
            {
                "advantages": [
                    "total geiler diebstahlschutz",
                    "was gegen Wasser",
                    "mit Soße"
                ],
                "defaultPaymentInterval": "monthly",
                "deviceClass": "9025",
                "documents": [
                    {
                        "name": "GU WG DE KS 0419_RECHTSDOKUMENTE.PDF",
                        "type": "LN",
                        "uri": "http://localhost:3000/wertgarantie/documents/da39a3ee5e6b4b0d3255bfef95601890afd80709"
                    }
                ],
                "id": "bb91b2de-cbb9-49e8-a3a5-1b6e8296403d",
                "name": "Komplettschutz mit Premium-Option",
                "priceRange": {
                    "maxOpen": 80001,
                    "minClose": 30001
                },
                "prices": {
                    "halfYearly": {
                        "currency": "EUR",
                        "netAmount": 5970,
                        "taxAmount": 953
                    },
                    "monthly": {
                        "currency": "EUR",
                        "netAmount": 995,
                        "taxAmount": 159
                    },
                    "quarterly": {
                        "currency": "EUR",
                        "netAmount": 2985,
                        "taxAmount": 477
                    },
                    "yearly": {
                        "currency": "EUR",
                        "netAmount": 11940,
                        "taxAmount": 1906
                    }
                },
                "shopDeviceClass": "Smartphone"
            }
        ])
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

test('getCondition should return NEW if no mapping is specified', () => {
    const condition = productOffersService.getCondition(undefined, "anything");
    expect(condition).toEqual(NEW);
});

test('getCondition should return UNKNOWN if mapping is specified but shop condition not found', () => {
    const mapping = [
        {
            shopCondition: "NEW",
            bifrostCondition: NEW
        }
    ]
    const condition = productOffersService.getCondition(mapping, "unknown condition");
    expect(condition).toEqual(UNKNOWN);
});

test('getCondition should return mapped condition', () => {
    const mapping = [
        {
            shopCondition: "finest",
            bifrostCondition: NEW
        }
    ]
    const condition = productOffersService.getCondition(mapping, "finest");
    expect(condition).toEqual(NEW);
});

test('getCondition should return NEW if given condition is undefined', () => {
    const mapping = [
        {
            shopCondition: "finest",
            bifrostCondition: NEW
        }
    ]
    const condition = productOffersService.getCondition(mapping, undefined);
    expect(condition).toEqual(NEW);
});

