exports.productOffersPhone =
    [
        {
            "id": "9338a770-0d0d-4203-8d54-583a03bdebf3",
            "name": "Komplettschutz",
            "shortName": "Basisschutz",
            "advantages": [
                "Für private und berufliche Nutzung",
                "Unsachgemäße Handhabung",
                "Weltweiter Schutz",
                "Volle Kostenübernahme bei Reparaturen",
                "Bei Totalschaden zählt der Zeitwert",
                "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte",
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
                    "uri": "http://localhost:3000/documents/justnotthere",
                    "type": "GTCI",
                    "name": "GTCI.PDF"
                },
                {
                    "uri": "http://localhost:3000/documents/justnotthere",
                    "type": "IPID",
                    "name": "IPID.PDF"
                },
                {
                    "uri": "http://localhost:3000/documents/justnotthere",
                    "type": "GDPR",
                    "name": "GDPR.PDF"
                },
                {
                    "uri": "http://localhost:3000/documents/justnotthere",
                    "type": "ROW",
                    "name": "Widerrufsbelehrung für Komplettschutz.pdf.PDF"
                }
            ]
        },
        {
            "id": "bb91b2de-cbb9-49e8-a3a5-1b6e8296403d",
            "name": "Komplettschutz mit Premium-Option",
            "shortName": "Premiumschutz",
            "advantages": [
                "Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten",
                "Diebstahlschutz",
                "Keine Selbstbeteiligung im Schadensfall",
                "Für private und berufliche Nutzung",
                "Unsachgemäße Handhabung",
                "Weltweiter Schutz",
                "Volle Kostenübernahme bei Reparaturen",
                "Bei Totalschaden zählt der Zeitwert",
                "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte",
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
                    "uri": "http://localhost:3000/documents/justnotthere",
                    "type": "IPID",
                    "name": "IPID.PDF"
                },
                {
                    "uri": "http://localhost:3000/documents/justnotthere",
                    "type": "GTCI",
                    "name": "GTCI.PDF"
                },
                {
                    "uri": "http://localhost:3000/documents/justnotthere",
                    "type": "GDPR",
                    "name": "GDPR.PDF"
                },
                {
                    "uri": "http://localhost:3000/documents/justnotthere",
                    "type": "ROW",
                    "name": "Widerrufsbelehrung für Komplettschutz.pdf.PDF"
                }
            ]
        }
    ];

exports.productOffersBike = [
    {
        "id": "898402ea-1fa8-4493-a99a-eebb594d5cf3",
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
        "shortName": "Variante A",
        "risks": [
            "KOMPLETTSCHUTZ_RAD"
        ],
        "devices": [
            {
                "intervals": [
                    {
                        "description": "monatlich",
                        "intervalCode": "1",
                        "priceRangePremiums": [
                            {
                                "maxOpen": 50001,
                                "minClose": 0,
                                "insurancePremium": 1200
                            },
                            {
                                "maxOpen": 75001,
                                "minClose": 50001,
                                "insurancePremium": 1500
                            },
                            {
                                "maxOpen": 100001,
                                "minClose": 75001,
                                "insurancePremium": 2000
                            },
                            {
                                "maxOpen": 150001,
                                "minClose": 100001,
                                "insurancePremium": 2800
                            },
                            {
                                "maxOpen": 200001,
                                "minClose": 150001,
                                "insurancePremium": 3500
                            },
                            {
                                "maxOpen": 400000,
                                "minClose": 200001,
                                "insurancePremium": 3500
                            }
                        ]
                    },
                    {
                        "description": "vierteljährlich",
                        "intervalCode": "3",
                        "priceRangePremiums": [
                            {
                                "maxOpen": 50001,
                                "minClose": 0,
                                "insurancePremium": 3600
                            },
                            {
                                "maxOpen": 75001,
                                "minClose": 50001,
                                "insurancePremium": 4500
                            },
                            {
                                "maxOpen": 100001,
                                "minClose": 75001,
                                "insurancePremium": 6000
                            },
                            {
                                "maxOpen": 150001,
                                "minClose": 100001,
                                "insurancePremium": 8400
                            },
                            {
                                "maxOpen": 200001,
                                "minClose": 150001,
                                "insurancePremium": 10500
                            },
                            {
                                "maxOpen": 400000,
                                "minClose": 200001,
                                "insurancePremium": 10500
                            }
                        ]
                    },
                    {
                        "description": "halbjährlich",
                        "intervalCode": "6",
                        "priceRangePremiums": [
                            {
                                "maxOpen": 50001,
                                "minClose": 0,
                                "insurancePremium": 7200
                            },
                            {
                                "maxOpen": 75001,
                                "minClose": 50001,
                                "insurancePremium": 9000
                            },
                            {
                                "maxOpen": 100001,
                                "minClose": 75001,
                                "insurancePremium": 12000
                            },
                            {
                                "maxOpen": 150001,
                                "minClose": 100001,
                                "insurancePremium": 16800
                            },
                            {
                                "maxOpen": 200001,
                                "minClose": 150001,
                                "insurancePremium": 21000
                            },
                            {
                                "maxOpen": 400000,
                                "minClose": 200001,
                                "insurancePremium": 21000
                            }
                        ]
                    },
                    {
                        "description": "jährlich",
                        "intervalCode": "12",
                        "priceRangePremiums": [
                            {
                                "maxOpen": 50001,
                                "minClose": 0,
                                "insurancePremium": 14400
                            },
                            {
                                "maxOpen": 75001,
                                "minClose": 50001,
                                "insurancePremium": 18000
                            },
                            {
                                "maxOpen": 100001,
                                "minClose": 75001,
                                "insurancePremium": 24000
                            },
                            {
                                "maxOpen": 150001,
                                "minClose": 100001,
                                "insurancePremium": 33600
                            },
                            {
                                "maxOpen": 200001,
                                "minClose": 150001,
                                "insurancePremium": 42000
                            },
                            {
                                "maxOpen": 400000,
                                "minClose": 200001,
                                "insurancePremium": 42000
                            }
                        ]
                    }
                ],
                "objectCode": "27",
                "maxPriceLimitation": 400000,
                "objectCodeExternal": "Bike"
            }
        ],
        "clientId": "ad0a99e6-a165-4eda-91fc-564fb3f935b4",
        "documents": [
            {
                "documentId": "cc2bc89fc011e4ab94098e4b97d154b3cdf67938",
                "documentType": "GTCI",
                "documentTitle": "GTCI.pdf"
            },
            {
                "documentId": "1e4f729671f2393b0e4b4b4354d7b108c7a79cd3",
                "documentType": "IPID",
                "documentTitle": "IPID.pdf"
            },
            {
                "documentId": "0ec1f087c50f44c1f885a28c855f0d4f7dec1073",
                "documentType": "GDPR",
                "documentTitle": "GDPR.pdf"
            },
            {
                "documentId": "267cc612fd1a34bcd48fbe3402b1860a302b6823",
                "documentType": "ROW",
                "documentTitle": "Widerrufsbelehrung für Komplettschutz.pdf"
            }
        ],
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
        "productType": "KOMPLETTSCHUTZ_RAD_M_2018",
        "applicationCode": "GU WG DE RAD KS 0818",
        "defaultPaymentInterval": "monthly"
    },
    {
        "id": "93582586-8c75-43b7-8cd1-ea658c3d7f8b",
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
        "shortName": "Variante B",
        "risks": [
            "KOMPLETTSCHUTZ_RAD"
        ],
        "devices": [
            {
                "intervals": [
                    {
                        "description": "jährlich",
                        "intervalCode": "12",
                        "priceRangePremiums": [
                            {
                                "maxOpen": 50001,
                                "minClose": 0,
                                "insurancePremium": 10900
                            },
                            {
                                "maxOpen": 75001,
                                "minClose": 50001,
                                "insurancePremium": 13900
                            },
                            {
                                "maxOpen": 100001,
                                "minClose": 75001,
                                "insurancePremium": 18900
                            },
                            {
                                "maxOpen": 150001,
                                "minClose": 100001,
                                "insurancePremium": 26900
                            },
                            {
                                "maxOpen": 200001,
                                "minClose": 150001,
                                "insurancePremium": 33900
                            },
                            {
                                "maxOpen": 400000,
                                "minClose": 200001,
                                "insurancePremium": 33900
                            }
                        ]
                    }
                ],
                "objectCode": "27",
                "maxPriceLimitation": 400000,
                "objectCodeExternal": "Bike"
            }
        ],
        "clientId": "ad0a99e6-a165-4eda-91fc-564fb3f935b4",
        "documents": [
            {
                "documentId": "cc2bc89fc011e4ab94098e4b97d154b3cdf67938",
                "documentType": "GTCI",
                "documentTitle": "GTCI.pdf"
            },
            {
                "documentId": "1e4f729671f2393b0e4b4b4354d7b108c7a79cd3",
                "documentType": "IPID",
                "documentTitle": "IPID.pdf"
            },
            {
                "documentId": "0ec1f087c50f44c1f885a28c855f0d4f7dec1073",
                "documentType": "GDPR",
                "documentTitle": "GDPR.pdf"
            },
            {
                "documentId": "267cc612fd1a34bcd48fbe3402b1860a302b6823",
                "documentType": "ROW",
                "documentTitle": "Widerrufsbelehrung für Komplettschutz.pdf"
            }
        ],
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
        "applicationCode": "GU WG DE RAD KS 0818",
        "defaultPaymentInterval": "yearly"
    },
    {
        "id": "2eca354a-ea54-43bf-b4ea-e456f4ed7cc9",
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
        "shortName": "Variante A",
        "risks": [
            "KOMPLETTSCHUTZ_EBIKE"
        ],
        "devices": [
            {
                "intervals": [
                    {
                        "description": "monatlich",
                        "intervalCode": "1",
                        "priceRangePremiums": [
                            {
                                "maxOpen": 150001,
                                "minClose": 0,
                                "insurancePremium": 1500
                            },
                            {
                                "maxOpen": 300001,
                                "minClose": 150001,
                                "insurancePremium": 2000
                            },
                            {
                                "maxOpen": 400001,
                                "minClose": 300001,
                                "insurancePremium": 3000
                            },
                            {
                                "maxOpen": 600000,
                                "minClose": 400001,
                                "insurancePremium": 3000
                            }
                        ]
                    },
                    {
                        "description": "vierteljährlich",
                        "intervalCode": "3",
                        "priceRangePremiums": [
                            {
                                "maxOpen": 150001,
                                "minClose": 0,
                                "insurancePremium": 4500
                            },
                            {
                                "maxOpen": 300001,
                                "minClose": 150001,
                                "insurancePremium": 6000
                            },
                            {
                                "maxOpen": 400001,
                                "minClose": 300001,
                                "insurancePremium": 9000
                            },
                            {
                                "maxOpen": 600000,
                                "minClose": 400001,
                                "insurancePremium": 9000
                            }
                        ]
                    },
                    {
                        "description": "halbjährlich",
                        "intervalCode": "6",
                        "priceRangePremiums": [
                            {
                                "maxOpen": 150001,
                                "minClose": 0,
                                "insurancePremium": 9000
                            },
                            {
                                "maxOpen": 300001,
                                "minClose": 150001,
                                "insurancePremium": 12000
                            },
                            {
                                "maxOpen": 400001,
                                "minClose": 300001,
                                "insurancePremium": 18000
                            },
                            {
                                "maxOpen": 600000,
                                "minClose": 400001,
                                "insurancePremium": 18000
                            }
                        ]
                    },
                    {
                        "description": "jährlich",
                        "intervalCode": "12",
                        "priceRangePremiums": [
                            {
                                "maxOpen": 150001,
                                "minClose": 0,
                                "insurancePremium": 18000
                            },
                            {
                                "maxOpen": 300001,
                                "minClose": 150001,
                                "insurancePremium": 24000
                            },
                            {
                                "maxOpen": 400001,
                                "minClose": 300001,
                                "insurancePremium": 36000
                            },
                            {
                                "maxOpen": 600000,
                                "minClose": 400001,
                                "insurancePremium": 36000
                            }
                        ]
                    }
                ],
                "objectCode": "270009",
                "maxPriceLimitation": 600000,
                "objectCodeExternal": "E-Bike"
            }
        ],
        "clientId": "ad0a99e6-a165-4eda-91fc-564fb3f935b4",
        "documents": [
            {
                "documentId": "cc2bc89fc011e4ab94098e4b97d154b3cdf67938",
                "documentType": "GTCI",
                "documentTitle": "GTCI.pdf"
            },
            {
                "documentId": "1e4f729671f2393b0e4b4b4354d7b108c7a79cd3",
                "documentType": "IPID",
                "documentTitle": "IPID.pdf"
            },
            {
                "documentId": "0ec1f087c50f44c1f885a28c855f0d4f7dec1073",
                "documentType": "GDPR",
                "documentTitle": "GDPR.pdf"
            },
            {
                "documentId": "267cc612fd1a34bcd48fbe3402b1860a302b6823",
                "documentType": "ROW",
                "documentTitle": "Widerrufsbelehrung für Komplettschutz.pdf"
            }
        ],
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
        "applicationCode": "GU WG DE RAD EBS 0818",
        "defaultPaymentInterval": "monthly"
    },
    {
        "id": "87c1a231-23c3-4f1a-b808-3c5b26cc5852",
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
        "shortName": "Variante B",
        "risks": [
            "KOMPLETTSCHUTZ_EBIKE"
        ],
        "devices": [
            {
                "intervals": [
                    {
                        "description": "jährlich",
                        "intervalCode": "12",
                        "priceRangePremiums": [
                            {
                                "maxOpen": 150001,
                                "minClose": 0,
                                "insurancePremium": 9000
                            },
                            {
                                "maxOpen": 300001,
                                "minClose": 150001,
                                "insurancePremium": 12000
                            },
                            {
                                "maxOpen": 400001,
                                "minClose": 300001,
                                "insurancePremium": 18000
                            },
                            {
                                "maxOpen": 600000,
                                "minClose": 400001,
                                "insurancePremium": 18000
                            }
                        ]
                    }
                ],
                "objectCode": "270009",
                "maxPriceLimitation": 600000,
                "objectCodeExternal": "E-Bike"
            }
        ],
        "clientId": "ad0a99e6-a165-4eda-91fc-564fb3f935b4",
        "documents": [
            {
                "documentId": "cc2bc89fc011e4ab94098e4b97d154b3cdf67938",
                "documentType": "GTCI",
                "documentTitle": "GTCI.pdf"
            },
            {
                "documentId": "1e4f729671f2393b0e4b4b4354d7b108c7a79cd3",
                "documentType": "IPID",
                "documentTitle": "IPID.pdf"
            },
            {
                "documentId": "0ec1f087c50f44c1f885a28c855f0d4f7dec1073",
                "documentType": "GDPR",
                "documentTitle": "GDPR.pdf"
            },
            {
                "documentId": "267cc612fd1a34bcd48fbe3402b1860a302b6823",
                "documentType": "ROW",
                "documentTitle": "Widerrufsbelehrung für Komplettschutz.pdf"
            }
        ],
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
        "applicationCode": "GU WG DE RAD EBS 0818",
        "defaultPaymentInterval": "yearly"
    }
];

exports.productOffersWithoutDocuments = [
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
        "documents": []
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
        "documents": []
    }
];