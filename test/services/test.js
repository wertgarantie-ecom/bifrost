test("bla", () => {
    const testdata = {
        id: "433295ef-ec5d-45d2-8701-d530e44fcf88",
        name: "Test Shop Handy",
        heimdallClientId: "test-phone-heimdall-clientId",
        webservices: {
            username: "test-phone-user",
            password: "test-phone-password"

        },
        activePartnerNumber: 11111,
        secrets: [
            "secret:test-phone-secret"
        ],
        publicClientIds: [
            "public:5209d6ea-1a6e-11ea-9f8d-778f0ad9137f"
        ],
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
                                maxOpen: 30001
                            },
                            {
                                minClose: 30001,
                                maxOpen: 80001
                            },
                            {
                                minClose: 80001,
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
                                maxOpen: 30001
                            },
                            {
                                minClose: 30001,
                                maxOpen: 80001
                            },
                            {
                                minClose: 80001,
                                maxOpen: 180001
                            }
                        ]
                    }

                ],
                documents: {
                    legalDocuments: [
                        {
                            type: "LN",
                            pattern: 'GU WG DE KS 0419_RECHTSDOKUMENTE.PDF'
                        }
                    ],
                    comparisonDocuments: []
                },
                advantages: [
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
                                maxOpen: 30001
                            },
                            {
                                minClose: 30001,
                                maxOpen: 80001
                            },
                            {
                                minClose: 80001,
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
                                maxOpen: 30001
                            },
                            {
                                minClose: 30001,
                                maxOpen: 80001
                            },
                            {
                                minClose: 80001,
                                maxOpen: 180001
                            }
                        ]
                    }

                ],
                documents: {
                    legalDocuments: [
                        {
                            type: "LN",
                            pattern: 'GU WG DE KS 0419_RECHTSDOKUMENTE.PDF'
                        }
                    ],
                    comparisonDocuments: []
                },
                advantages: [
                    "Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten",
                    "Diebstahlschutz",
                    "Keine Selbstbeteiligung im Schadensfall",
                    "einfacher Diebstahl",
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
                risks: ["DIEBSTAHLSCHUTZ"]
            }
        ]
    };
    console.log(testdata);
})