const intervalPremiumsForKS = [
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

exports.completeWebserviceProductOffers = [
    {
        name: "Komplettschutz",
        id: "bb91b2de-cbb9-49e8-a3a5-1b6e8296403d",
        clientId: "testClientId",
        applicationCode: "GU WG DE KS 0419",
        productType: "KOMPLETTSCHUTZ_2019",
        defaultPaymentInterval: "monthly",
        risks: ["KOMPLETTSCHUTZ"],
        documents: [
            {
                documentId: "1234",
                documentTitle: "GU WG DE KS 0419_RECHTSDOKUMENTE.PDF",
                documentType: "LN"
            }
        ],
        advantages: [],
        devices: intervalPremiumsForKS
    },
    {
        name: "Komplettschutz mit Premium-Option",
        id: "f3125c49-5c7b-41b8-acfe-2dffe91cc3dd",
        clientId: "testClientId",
        applicationCode: "GU WG DE KS 0419",
        productType: "KOMPLETTSCHUTZ_2019",
        defaultPaymentInterval: "monthly",
        risks: ["KOMPLETTSCHUTZ", "DIEBSTAHLSCHUTZ"],
        documents: [
            {
                documentId: "1234",
                documentTitle: "GU WG DE KS 0419_RECHTSDOKUMENTE.PDF",
                documentType: "LN"
            }
        ],
        advantages: [],
        devices: intervalPremiumsForKS
    }
];
