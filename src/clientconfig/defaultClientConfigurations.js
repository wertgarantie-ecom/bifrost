const defaultHandbookConfig = {
    "features": [],
    "components": {
        "selectionpopup": {},
        "confirmation": {},
        "aftersales": {}
    }
}

module.exports = {
    "bike": {
        "handbook": defaultHandbookConfig,
        "backends": {
            "webservices": {
                "productOffersConfigurations": [
                    {
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
                        },
                        "name": "Fahrrad-Komplettschutz mit monatlicher Zahlweise",
                        "backgroundStyle": "primary",
                        "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Bike/fahrrad_1.jpg",
                        "risks": [],
                        "documents": {
                            "legalDocuments": [
                                "GTCI",
                                "IPID",
                                "GDPR",
                                "ROW"
                            ],
                            "comparisonDocuments": []
                        },
                        "shortName": "Variante A",
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
                        "priceRanges": [
                            {
                                "maxOpen": 50001,
                                "minClose": 0
                            },
                            {
                                "maxOpen": 75001,
                                "minClose": 50001
                            },
                            {
                                "maxOpen": 100001,
                                "minClose": 75001
                            },
                            {
                                "maxOpen": 150001,
                                "minClose": 100001
                            },
                            {
                                "maxOpen": 200001,
                                "minClose": 150001
                            },
                            {
                                "maxOpen": 400000,
                                "minClose": 200001
                            }
                        ],
                        "productType": "KOMPLETTSCHUTZ_RAD_M_2018",
                        "basicRiskType": "KOMPLETTSCHUTZ_RAD",
                        "deviceClasses": [
                            {
                                "objectCode": "27",
                                "objectCodeExternal": "Bike"
                            }
                        ],
                        "applicationCode": "GU WG DE RAD KS 0818",
                        "defaultPaymentInterval": "monthly"
                    },
                    {
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
                        },
                        "name": "Fahrrad-Komplettschutz mit jährlicher Zahlweise",
                        "backgroundStyle": "secondary",
                        "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Bike/fahrrad_2.jpg",
                        "risks": [],
                        "documents": {
                            "legalDocuments": [
                                "GTCI",
                                "IPID",
                                "GDPR",
                                "ROW"
                            ],
                            "comparisonDocuments": []
                        },
                        "shortName": "Variante B",
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
                        "productType": "KOMPLETTSCHUTZ_RAD_J_2018",
                        "basicRiskType": "KOMPLETTSCHUTZ_RAD",
                        "priceRanges": [
                            {
                                "maxOpen": 50001,
                                "minClose": 0
                            },
                            {
                                "maxOpen": 75001,
                                "minClose": 50001
                            },
                            {
                                "maxOpen": 100001,
                                "minClose": 75001
                            },
                            {
                                "maxOpen": 150001,
                                "minClose": 100001
                            },
                            {
                                "maxOpen": 200001,
                                "minClose": 150001
                            },
                            {
                                "maxOpen": 400000,
                                "minClose": 200001
                            }
                        ],
                        "deviceClasses": [
                            {
                                "objectCode": "27",
                                "objectCodeExternal": "Bike"
                            }
                        ],
                        "applicationCode": "GU WG DE RAD KS 0818",
                        "defaultPaymentInterval": "yearly"
                    },
                    {
                        "lock": {
                            "priceRanges": [
                                {
                                    "maxOpen": 600001,
                                    "minClose": 0,
                                    "requiredLockPrice": 4900
                                }
                            ]
                        },
                        "name": "E-Bike-Komplettschutz mit monatlicher Zahlweise",
                        "backgroundStyle": "primary",
                        "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/E-Bike/ebike_1.jpg",
                        "risks": [],
                        "documents": {
                            "legalDocuments": [
                                "GTCI",
                                "IPID",
                                "GDPR",
                                "ROW"
                            ],
                            "comparisonDocuments": []
                        },
                        "shortName": "Variante A",
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
                        "productType": "KOMPLETTSCHUTZ_EBIKE_M_2018",
                        "basicRiskType": "KOMPLETTSCHUTZ_EBIKE",
                        "priceRanges": [
                            {
                                "maxOpen": 150001,
                                "minClose": 0
                            },
                            {
                                "maxOpen": 300001,
                                "minClose": 150001
                            },
                            {
                                "maxOpen": 400001,
                                "minClose": 300001
                            },
                            {
                                "maxOpen": 600000,
                                "minClose": 400001
                            }
                        ],
                        "deviceClasses": [
                            {
                                "objectCode": "270009",
                                "objectCodeExternal": "E-Bike"
                            }
                        ],
                        "applicationCode": "GU WG DE RAD EBS 0818",
                        "defaultPaymentInterval": "monthly"
                    },
                    {
                        "lock": {
                            "priceRanges": [
                                {
                                    "maxOpen": 600001,
                                    "minClose": 0,
                                    "requiredLockPrice": 4900
                                }
                            ]
                        },
                        "name": "E-Bike-Komplettschutz mit jährlicher Zahlweise",
                        "backgroundStyle": "secondary",
                        "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/E-Bike/ebike_2.jpg",
                        "risks": [],
                        "documents": {
                            "legalDocuments": [
                                "GTCI",
                                "IPID",
                                "GDPR",
                                "ROW"
                            ],
                            "comparisonDocuments": []
                        },
                        "shortName": "Variante B",
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
                        "productType": "KOMPLETTSCHUTZ_EBIKE_J_2018",
                        "basicRiskType": "KOMPLETTSCHUTZ_EBIKE",
                        "priceRanges": [
                            {
                                "maxOpen": 150001,
                                "minClose": 0
                            },
                            {
                                "maxOpen": 300001,
                                "minClose": 150001
                            },
                            {
                                "maxOpen": 400001,
                                "minClose": 300001
                            },
                            {
                                "maxOpen": 600000,
                                "minClose": 400001
                            }
                        ],
                        "deviceClasses": [
                            {
                                "objectCode": "270009",
                                "objectCodeExternal": "E-Bike"
                            }
                        ],
                        "applicationCode": "GU WG DE RAD EBS 0818",
                        "defaultPaymentInterval": "yearly"
                    }
                ]
            }
        }
    },
    "smartphone": {
        "handbook": defaultHandbookConfig,
        "backends": {
            "webservices": {
                "productOffersConfigurations": [
                    {
                        "name": "Komplettschutz mit Premium-Option",
                        "backgroundStyle": "primary",
                        "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test.jpg",
                        "shortName": "Premiumschutz",
                        "productType": "KOMPLETTSCHUTZ_2019",
                        "applicationCode": "GU WG DE KS 0419",
                        "basicRiskType": "KOMPLETTSCHUTZ",
                        "defaultPaymentInterval": "monthly",
                        "priceRanges": [
                            {
                                "minClose": 0,
                                "maxOpen": 30001
                            },
                            {
                                "minClose": 30001,
                                "maxOpen": 80001
                            },
                            {
                                "minClose": 80001,
                                "maxOpen": 180000
                            }
                        ],
                        "deviceClasses": [
                            {
                                "objectCode": "9025",
                                "objectCodeExternal": "Smartphone"
                            },
                            {
                                "objectCode": "73",
                                "objectCodeExternal": "Mobilfunk"
                            }
                        ],
                        "documents": {
                            "legalDocuments": [
                                "GTCI",
                                "IPID",
                                "GDPR",
                                "ROW"
                            ],
                            "comparisonDocuments": []
                        },
                        "advantages": [
                            "Diebstahlschutz",
                            "Keine Selbstbeteiligung",
                            "Cyberschutz",
                            "Displaybruch",
                            "Bei Totalschaden zählt der Zeitwert",
                            "Für private und berufliche Nutzung",
                            "Volle Kostenübernahme bei Reparaturen (inkl. Fall- und Sturzschäden, Display- und Bruchschäden, Bedienfehlern, Motor-Lagerschäden, Wasserschäden, Elektronikschäden, Verkalkung, Verschleiß, uvm.)",
                            "Weltweiter Schutz",
                            "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte",
                            "Unsachgemäße Handhabung",
                            "Wasserschaden"
                        ],
                        "risks": [
                            "DIEBSTAHLSCHUTZ"
                        ]
                    },
                    {
                        "name": "Komplettschutz",
                        "backgroundStyle": "secondary",
                        "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test2.jpg",
                        "shortName": "Basisschutz",
                        "productType": "KOMPLETTSCHUTZ_2019",
                        "applicationCode": "GU WG DE KS 0419",
                        "basicRiskType": "KOMPLETTSCHUTZ",
                        "defaultPaymentInterval": "monthly",
                        "priceRanges": [
                            {
                                "minClose": 0,
                                "maxOpen": 30001
                            },
                            {
                                "minClose": 30001,
                                "maxOpen": 80001
                            },
                            {
                                "minClose": 80001,
                                "maxOpen": 180000
                            }
                        ],
                        "deviceClasses": [
                            {
                                "objectCode": "9025",
                                "objectCodeExternal": "Smartphone"
                            },
                            {
                                "objectCode": "73",
                                "objectCodeExternal": "Mobilfunk"
                            }
                        ],
                        "documents": {
                            "legalDocuments": [
                                "GTCI",
                                "IPID",
                                "GDPR",
                                "ROW"
                            ],
                            "comparisonDocuments": []
                        },
                        "advantages": [
                            "Displaybruch",
                            "Bei Totalschaden zählt der Zeitwert",
                            "Für private und berufliche Nutzung",
                            "Volle Kostenübernahme bei Reparaturen (inkl. Fall- und Sturzschäden, Display- und Bruchschäden, Bedienfehlern, Motor-Lagerschäden, Wasserschäden, Elektronikschäden, Verkalkung, Verschleiß, uvm.)",
                            "Weltweiter Schutz",
                            "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte",
                            "Unsachgemäße Handhabung",
                            "Wasserschaden"
                        ],
                        "risks": []
                    }
                ]
            }
        }
    }
}