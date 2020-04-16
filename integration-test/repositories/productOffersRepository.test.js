const repository = require('../../src/repositories/productOffersRepository');

describe("test handle product offers for client", () => {
    test("persist productOffersForClient", async () => {
        const productOffers = [
            {
                name: "Komplettschutz",
                id: "productOfferUuid",
                clientId: "testClientId",
                documents: [
                    {
                        document_title: "GU WG DE KS 0419_RECHTSDOKUMENTE.PDF",
                        document_type: "LN"
                    }
                ],
                advantages: [],
                devices: expectedIntervalPremiumsForKS
            },
            {
                name: "Komplettschutz mit Premium-Option",
                id: "productOfferUuid",
                clientId: "testClientId",
                documents: [
                    {
                        document_title: "GU WG DE KS 0419_RECHTSDOKUMENTE.PDF",
                        document_type: "LN"
                    }
                ],
                advantages: [],
                devices: expectedIntervalPremiumsForKS
            }
        ];

        const result = await repository.persistProductOffersForClient(productOffers);
        expect(result).toEqual({

        });
    });
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