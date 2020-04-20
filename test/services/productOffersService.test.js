const productOffersService = require('../../src/services/productOffersService');

test("test webservices product offer conversion", async () => {
    const clientConfig = {
        id: 'clientId'
    };
    const mockProductOffersRepository = {
        findByClientId: () => productOffersResult
    };
    const result = await productOffersService.getProductOffers(clientConfig, "Smartphone", 80000, mockProductOffersRepository);

    expect(result).toEqual({
        "id": "9338a770-0d0d-4203-8d54-583a03bdebf3",
        "name": "Komplettschutz",
        "advantages": [
            "Das schon toll hier",
            "alles wird gut",
            "Corona Party!!!"
        ],
        "prices": {
            "monthly": {
                "price": 800,
                "price_currency": "€",
                "price_tax": 128
            },
            "quarterly": {
                "price": 2400,
                "price_currency": "€",
                "price_tax": 383
            },
            "halfYearly": {
                "price": 4800,
                "price_currency": "€",
                "price_tax": 766
            },
            "yearly": {
                "price": 9600,
                "price_currency": "€",
                "price_tax": 1533
            }
        },
        "documents": [
            {
                "documentId": "da39a3ee5e6b4b0d3255bfef95601890afd80709",
                "documentType": "LN",
                "documentTitle": "GU WG DE KS 0419_RECHTSDOKUMENTE.PDF"
            }
        ],
    })
});

const productOffersResult = [
    {
        "id": "9338a770-0d0d-4203-8d54-583a03bdebf3",
        "name": "Komplettschutz",
        "risks": [],
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
        "devices": [
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