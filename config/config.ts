const config = {
    "heimdall": {
        "clientId": "test-phone-heimdall-clientId",
        "deviceClassMappings": [
            {
                "shopDeviceClass": "Smartphone",
                "heimdallDeviceClass": "1dfd4549-9bdc-4285-9047-e5088272dade"
            }
        ]
    },
    "webservices": {
        "password": "2PAYKD4X",
        "username": "1400689",
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
                "name": "Fahrrad-Versicherung mit monatlicher Zahlweise",
                "risks": [],
                "title": "Ihre WERTGARANTIE Fahrrad-Versicherung",
                "documents": {
                    "legalDocuments": [
                        "GTCI",
                        "IPID",
                        "GDPR",
                        "ROW"
                    ],
                    "comparisonDocuments": []
                },
                "shortName": "Fahrrad-Versicherung",
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
                "backgroundStyle": "primary",
                "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Bike/fahrrad_1.jpg",
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
                "name": "Fahrrad-Versicherung mit jährlicher Zahlweise",
                "risks": [],
                "title": "Ihre WERTGARANTIE Fahrrad-Versicherung",
                "documents": {
                    "legalDocuments": [
                        "GTCI",
                        "IPID",
                        "GDPR",
                        "ROW"
                    ],
                    "comparisonDocuments": []
                },
                "shortName": "Fahrrad-Versicherung",
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
                "productType": "KOMPLETTSCHUTZ_RAD_J_2018",
                "basicRiskType": "KOMPLETTSCHUTZ_RAD",
                "deviceClasses": [
                    {
                        "objectCode": "27",
                        "objectCodeExternal": "Bike"
                    }
                ],
                "applicationCode": "GU WG DE RAD KS 0818",
                "backgroundStyle": "secondary",
                "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Bike/fahrrad_2.jpg",
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
                "name": "E-Bike-Versicherung mit monatlicher Zahlweise",
                "risks": [],
                "title": "Ihre WERTGARANTIE E-Bike-Versicherung",
                "documents": {
                    "legalDocuments": [
                        "GTCI",
                        "IPID",
                        "GDPR",
                        "ROW"
                    ],
                    "comparisonDocuments": []
                },
                "shortName": "E-Bike-Versicherung",
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
                "productType": "KOMPLETTSCHUTZ_EBIKE_M_2018",
                "basicRiskType": "KOMPLETTSCHUTZ_EBIKE",
                "deviceClasses": [
                    {
                        "objectCode": "270009",
                        "objectCodeExternal": "E-Bike"
                    }
                ],
                "applicationCode": "GU WG DE RAD EBS 0818",
                "backgroundStyle": "primary",
                "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/E-Bike/ebike_1.jpg",
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
                "name": "E-Bike-Versicherung mit jährlicher Zahlweise",
                "risks": [],
                "title": "Ihre WERTGARANTIE E-Bike-Versicherung",
                "documents": {
                    "legalDocuments": [
                        "GTCI",
                        "IPID",
                        "GDPR",
                        "ROW"
                    ],
                    "comparisonDocuments": []
                },
                "shortName": "E-Bike-Versicherung",
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
                "productType": "KOMPLETTSCHUTZ_EBIKE_J_2018",
                "basicRiskType": "KOMPLETTSCHUTZ_EBIKE",
                "deviceClasses": [
                    {
                        "objectCode": "270009",
                        "objectCodeExternal": "E-Bike"
                    }
                ],
                "applicationCode": "GU WG DE RAD EBS 0818",
                "backgroundStyle": "secondary",
                "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/E-Bike/ebike_2.jpg",
                "defaultPaymentInterval": "yearly"
            }
        ]
    }
}

const productOffersBOC = [{
    "id": "e7fdd56d-faaf-4cf8-85ff-24a303d726a1",
    "lock": {
        "priceRanges": [{"maxOpen": 100001, "minClose": 0, "requiredLockPrice": 1900}, {
            "maxOpen": 400001,
            "minClose": 100001,
            "requiredLockPrice": 4900
        }]
    },
    "name": "Fahrrad-Komplettschutz mit monatlicher Zahlweise",
    "risks": ["KOMPLETTSCHUTZ_RAD"],
    "devices": [{
        "intervals": [{
            "description": "monatlich",
            "intervalCode": "1",
            "priceRangePremiums": [{
                "maxOpen": 50001,
                "minClose": 0,
                "condition": "NEW",
                "insurancePremium": 900
            }, {"maxOpen": 75001, "minClose": 50001, "condition": "NEW", "insurancePremium": 1200}, {
                "maxOpen": 100001,
                "minClose": 75001,
                "condition": "NEW",
                "insurancePremium": 1500
            }, {
                "maxOpen": 150001,
                "minClose": 100001,
                "condition": "NEW",
                "insurancePremium": 2000
            }, {
                "maxOpen": 200001,
                "minClose": 150001,
                "condition": "NEW",
                "insurancePremium": 2800
            }, {"maxOpen": 400000, "minClose": 200001, "condition": "NEW", "insurancePremium": 3500}]
        }, {
            "description": "vierteljährlich",
            "intervalCode": "3",
            "priceRangePremiums": [{
                "maxOpen": 50001,
                "minClose": 0,
                "condition": "NEW",
                "insurancePremium": 2700
            }, {"maxOpen": 75001, "minClose": 50001, "condition": "NEW", "insurancePremium": 3600}, {
                "maxOpen": 100001,
                "minClose": 75001,
                "condition": "NEW",
                "insurancePremium": 4500
            }, {
                "maxOpen": 150001,
                "minClose": 100001,
                "condition": "NEW",
                "insurancePremium": 6000
            }, {
                "maxOpen": 200001,
                "minClose": 150001,
                "condition": "NEW",
                "insurancePremium": 8400
            }, {"maxOpen": 400000, "minClose": 200001, "condition": "NEW", "insurancePremium": 10500}]
        }, {
            "description": "halbjährlich",
            "intervalCode": "6",
            "priceRangePremiums": [{
                "maxOpen": 50001,
                "minClose": 0,
                "condition": "NEW",
                "insurancePremium": 5400
            }, {"maxOpen": 75001, "minClose": 50001, "condition": "NEW", "insurancePremium": 7200}, {
                "maxOpen": 100001,
                "minClose": 75001,
                "condition": "NEW",
                "insurancePremium": 9000
            }, {
                "maxOpen": 150001,
                "minClose": 100001,
                "condition": "NEW",
                "insurancePremium": 12000
            }, {
                "maxOpen": 200001,
                "minClose": 150001,
                "condition": "NEW",
                "insurancePremium": 16800
            }, {"maxOpen": 400000, "minClose": 200001, "condition": "NEW", "insurancePremium": 21000}]
        }, {
            "description": "jährlich",
            "intervalCode": "12",
            "priceRangePremiums": [{
                "maxOpen": 50001,
                "minClose": 0,
                "condition": "NEW",
                "insurancePremium": 10800
            }, {"maxOpen": 75001, "minClose": 50001, "condition": "NEW", "insurancePremium": 14400}, {
                "maxOpen": 100001,
                "minClose": 75001,
                "condition": "NEW",
                "insurancePremium": 18000
            }, {
                "maxOpen": 150001,
                "minClose": 100001,
                "condition": "NEW",
                "insurancePremium": 24000
            }, {
                "maxOpen": 200001,
                "minClose": 150001,
                "condition": "NEW",
                "insurancePremium": 33600
            }, {"maxOpen": 400000, "minClose": 200001, "condition": "NEW", "insurancePremium": 42000}]
        }], "objectCode": "27", "maxPriceLimitation": 400000, "objectCodeExternal": "Bike"
    }],
    "clientId": "06e1a5f8-48d9-4093-a674-476afb358a7a",
    "documents": [{
        "documentId": "c8cdbefa8c09e5855868371db2be4045f8611da0",
        "documentType": "GTCI",
        "documentTitle": "AVB RAD_optimiert.pdf"
    }, {
        "documentId": "a4158eed94d64148c16fef574fc9cf8550d77bdb",
        "documentType": "IPID",
        "documentTitle": "IPID RAD_optimiert.pdf"
    }, {
        "documentId": "8740c904a50abe239b240d23d053580971385e99",
        "documentType": "GDPR",
        "documentTitle": "WG DSGVO Informationspflichten Beileger 0619.pdf"
    }, {
        "documentId": "2c1490a8289a52c29a2852d4e98eb31124e96128",
        "documentType": "ROW",
        "documentTitle": "Widerrufsbelehrung.pdf"
    }],
    "shortName": "Variante A",
    "advantages": ["Materialfehler", "Konstruktionsfehler", "Verschleiß / Abnutzung / Alterung der Reifen und Schläuche (ab dem 7. Monat)", "Produktionsfehler", "Reparaturkosten", "Unsachgemäße Handhabung", "Vandalismus", "Fall- und Sturzschäden", "Unfallschäden", "Diebstahl des Fahrrads", "Teilediebstahl"],
    "productType": "KOMPLETTSCHUTZ_RAD_M_2018",
    "applicationCode": "GU WG DE RAD KS 0818",
    "backgroundStyle": "primary",
    "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Bike/fahrrad_2.jpg",
    "defaultPaymentInterval": "monthly"
}, {
    "id": "76b40728-a5cf-4fb1-8850-d1c4dd3058aa",
    "lock": {
        "priceRanges": [{"maxOpen": 100001, "minClose": 0, "requiredLockPrice": 1900}, {
            "maxOpen": 400001,
            "minClose": 100001,
            "requiredLockPrice": 4900
        }]
    },
    "name": "Fahrrad-Komplettschutz mit jährlicher Zahlweise",
    "risks": ["KOMPLETTSCHUTZ_RAD"],
    "devices": [{
        "intervals": [{
            "description": "jährlich",
            "intervalCode": "12",
            "priceRangePremiums": [{
                "maxOpen": 50001,
                "minClose": 0,
                "condition": "NEW",
                "insurancePremium": 8900
            }, {"maxOpen": 75001, "minClose": 50001, "condition": "NEW", "insurancePremium": 10900}, {
                "maxOpen": 100001,
                "minClose": 75001,
                "condition": "NEW",
                "insurancePremium": 13900
            }, {
                "maxOpen": 150001,
                "minClose": 100001,
                "condition": "NEW",
                "insurancePremium": 18900
            }, {
                "maxOpen": 200001,
                "minClose": 150001,
                "condition": "NEW",
                "insurancePremium": 26900
            }, {"maxOpen": 400000, "minClose": 200001, "condition": "NEW", "insurancePremium": 33900}]
        }], "objectCode": "27", "maxPriceLimitation": 400000, "objectCodeExternal": "Bike"
    }],
    "clientId": "06e1a5f8-48d9-4093-a674-476afb358a7a",
    "documents": [{
        "documentId": "c8cdbefa8c09e5855868371db2be4045f8611da0",
        "documentType": "GTCI",
        "documentTitle": "AVB RAD_optimiert.pdf"
    }, {
        "documentId": "a4158eed94d64148c16fef574fc9cf8550d77bdb",
        "documentType": "IPID",
        "documentTitle": "IPID RAD_optimiert.pdf"
    }, {
        "documentId": "8740c904a50abe239b240d23d053580971385e99",
        "documentType": "GDPR",
        "documentTitle": "WG DSGVO Informationspflichten Beileger 0619.pdf"
    }, {
        "documentId": "2c1490a8289a52c29a2852d4e98eb31124e96128",
        "documentType": "ROW",
        "documentTitle": "Widerrufsbelehrung.pdf"
    }],
    "shortName": "Variante B",
    "advantages": ["Materialfehler", "Konstruktionsfehler", "Produktionsfehler", "Reparaturkosten", "Unsachgemäße Handhabung", "Vandalismus", "Fall- und Sturzschäden", "Unfallschäden", "Diebstahl des Fahrrads", "Teilediebstahl"],
    "productType": "KOMPLETTSCHUTZ_RAD_J_2018",
    "applicationCode": "GU WG DE RAD KS 0818",
    "backgroundStyle": "secondary",
    "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Bike/fahrrad_1.jpg",
    "defaultPaymentInterval": "yearly"
}, {
    "id": "378cedb3-0d89-4a63-a254-a77875126bc8",
    "lock": {"priceRanges": [{"maxOpen": 600001, "minClose": 0, "requiredLockPrice": 4900}]},
    "name": "E-Bike-Komplettschutz mit monatlicher Zahlweise",
    "risks": ["KOMPLETTSCHUTZ_EBIKE"],
    "devices": [{
        "intervals": [{
            "description": "monatlich",
            "intervalCode": "1",
            "priceRangePremiums": [{
                "maxOpen": 150001,
                "minClose": 0,
                "condition": "NEW",
                "insurancePremium": 1200
            }, {
                "maxOpen": 300001,
                "minClose": 150001,
                "condition": "NEW",
                "insurancePremium": 1500
            }, {
                "maxOpen": 400001,
                "minClose": 300001,
                "condition": "NEW",
                "insurancePremium": 2000
            }, {"maxOpen": 600000, "minClose": 400001, "condition": "NEW", "insurancePremium": 3000}]
        }, {
            "description": "vierteljährlich",
            "intervalCode": "3",
            "priceRangePremiums": [{
                "maxOpen": 150001,
                "minClose": 0,
                "condition": "NEW",
                "insurancePremium": 3600
            }, {
                "maxOpen": 300001,
                "minClose": 150001,
                "condition": "NEW",
                "insurancePremium": 4500
            }, {
                "maxOpen": 400001,
                "minClose": 300001,
                "condition": "NEW",
                "insurancePremium": 6000
            }, {"maxOpen": 600000, "minClose": 400001, "condition": "NEW", "insurancePremium": 9000}]
        }, {
            "description": "halbjährlich",
            "intervalCode": "6",
            "priceRangePremiums": [{
                "maxOpen": 150001,
                "minClose": 0,
                "condition": "NEW",
                "insurancePremium": 7200
            }, {
                "maxOpen": 300001,
                "minClose": 150001,
                "condition": "NEW",
                "insurancePremium": 9000
            }, {
                "maxOpen": 400001,
                "minClose": 300001,
                "condition": "NEW",
                "insurancePremium": 12000
            }, {"maxOpen": 600000, "minClose": 400001, "condition": "NEW", "insurancePremium": 18000}]
        }, {
            "description": "jährlich",
            "intervalCode": "12",
            "priceRangePremiums": [{
                "maxOpen": 150001,
                "minClose": 0,
                "condition": "NEW",
                "insurancePremium": 14400
            }, {
                "maxOpen": 300001,
                "minClose": 150001,
                "condition": "NEW",
                "insurancePremium": 18000
            }, {
                "maxOpen": 400001,
                "minClose": 300001,
                "condition": "NEW",
                "insurancePremium": 24000
            }, {"maxOpen": 600000, "minClose": 400001, "condition": "NEW", "insurancePremium": 36000}]
        }], "objectCode": "270009", "maxPriceLimitation": 600000, "objectCodeExternal": "E-Bike"
    }],
    "clientId": "06e1a5f8-48d9-4093-a674-476afb358a7a",
    "documents": [{
        "documentId": "9ba7c8d82530a4c764ab294a98d3178dff398217",
        "documentType": "GTCI",
        "documentTitle": "AVB E-Bike_optimiert.pdf"
    }, {
        "documentId": "14be30d127558139f86b4c9d2ef4857365454aff",
        "documentType": "IPID",
        "documentTitle": "IPID E-Bike_optimiert.pdf"
    }, {
        "documentId": "8740c904a50abe239b240d23d053580971385e99",
        "documentType": "GDPR",
        "documentTitle": "WG DSGVO Informationspflichten Beileger 0619.pdf"
    }, {
        "documentId": "2c1490a8289a52c29a2852d4e98eb31124e96128",
        "documentType": "ROW",
        "documentTitle": "Widerrufsbelehrung.pdf"
    }],
    "shortName": "Variante A",
    "advantages": ["Materialfehler", "Konstruktionsfehler", "Verschleiß / Abnutzung / Alterung der Reifen und Schläuche (ab dem 7. Monat)", "Produktionsfehler", "Reparaturkosten", "Unsachgemäße Handhabung", "Vandalismus", "Verschleiß am eBike / Pedelec (ab dem 07. Monat)", "Verschleiß am Akku (ab dem 13. Monat)", "Wasser-/Feuchtigkeitsschäden", "Elektronikschäden", "Fall- und Sturzschäden", "Pick-up-Service", "Akku-Defekte", "Unfallschäden", "Diebstahl des E-Bikes/Pedelecs", "Teilediebstahl"],
    "productType": "KOMPLETTSCHUTZ_EBIKE_M_2018",
    "applicationCode": "GU WG DE RAD EBS 0818",
    "backgroundStyle": "primary",
    "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/E-Bike/ebike_1.jpg",
    "defaultPaymentInterval": "monthly"
}, {
    "id": "808d36bd-adfa-4223-ba55-54dde2a8a52b",
    "lock": {"priceRanges": [{"maxOpen": 600001, "minClose": 0, "requiredLockPrice": 4900}]},
    "name": "E-Bike-Komplettschutz mit jährlicher Zahlweise",
    "risks": ["KOMPLETTSCHUTZ_EBIKE"],
    "devices": [{
        "intervals": [{
            "description": "jährlich",
            "intervalCode": "12",
            "priceRangePremiums": [{
                "maxOpen": 150001,
                "minClose": 0,
                "condition": "NEW",
                "insurancePremium": 7200
            }, {
                "maxOpen": 300001,
                "minClose": 150001,
                "condition": "NEW",
                "insurancePremium": 9000
            }, {
                "maxOpen": 400001,
                "minClose": 300001,
                "condition": "NEW",
                "insurancePremium": 12000
            }, {"maxOpen": 600000, "minClose": 400001, "condition": "NEW", "insurancePremium": 18000}]
        }], "objectCode": "270009", "maxPriceLimitation": 600000, "objectCodeExternal": "E-Bike"
    }],
    "clientId": "06e1a5f8-48d9-4093-a674-476afb358a7a",
    "documents": [{
        "documentId": "9ba7c8d82530a4c764ab294a98d3178dff398217",
        "documentType": "GTCI",
        "documentTitle": "AVB E-Bike_optimiert.pdf"
    }, {
        "documentId": "14be30d127558139f86b4c9d2ef4857365454aff",
        "documentType": "IPID",
        "documentTitle": "IPID E-Bike_optimiert.pdf"
    }, {
        "documentId": "8740c904a50abe239b240d23d053580971385e99",
        "documentType": "GDPR",
        "documentTitle": "WG DSGVO Informationspflichten Beileger 0619.pdf"
    }, {
        "documentId": "2c1490a8289a52c29a2852d4e98eb31124e96128",
        "documentType": "ROW",
        "documentTitle": "Widerrufsbelehrung.pdf"
    }],
    "shortName": "Variante B",
    "advantages": ["Materialfehler", "Konstruktionsfehler", "Produktionsfehler", "Reparaturkosten", "Unsachgemäße Handhabung", "Vandalismus", "Verschleiß am eBike / Pedelec (ab dem 07. Monat)", "Verschleiß am Akku (ab dem 13. Monat)", "Wasser-/Feuchtigkeitsschäden", "Elektronikschäden", "Fall- und Sturzschäden", "Pick-up-Service", "Akku-Defekte", "Unfallschäden", "Diebstahl des E-Bikes/Pedelecs", "Teilediebstahl"],
    "productType": "KOMPLETTSCHUTZ_EBIKE_J_2018",
    "applicationCode": "GU WG DE RAD EBS 0818",
    "backgroundStyle": "secondary",
    "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/E-Bike/ebike_2.jpg",
    "defaultPaymentInterval": "yearly"
}]

const bla = {
    "webservices": {
        "password": "MNN2DDTS",
        "username": "1807460",
        "productOffersConfigurations": [
            {
                "name": "Komplettschutz mit Premium-Option",
                "risks": [
                    "DIEBSTAHLSCHUTZ"
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
                "shortName": "Premiumschutz",
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
                "priceRanges": [
                    {
                        "maxOpen": 30001,
                        "minClose": 0
                    },
                    {
                        "maxOpen": 80001,
                        "minClose": 30001
                    },
                    {
                        "maxOpen": 180000,
                        "minClose": 80001
                    },
                    {
                        "maxOpen": 180001,
                        "minClose": 0,
                        "condition": "USED"
                    }
                ],
                "productType": "KOMPLETTSCHUTZ_2019",
                "basicRiskType": "KOMPLETTSCHUTZ",
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
                "applicationCode": "GU WG DE KS 0419",
                "backgroundStyle": "primary",
                "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test.jpg",
                "defaultPaymentInterval": "monthly"
            },
            {
                "name": "Komplettschutz",
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
                "shortName": "Basisschutz",
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
                "priceRanges": [
                    {
                        "maxOpen": 30001,
                        "minClose": 0
                    },
                    {
                        "maxOpen": 80001,
                        "minClose": 30001
                    },
                    {
                        "maxOpen": 180000,
                        "minClose": 80001
                    },
                    {
                        "maxOpen": 180001,
                        "minClose": 0,
                        "condition": "USED"
                    }
                ],
                "productType": "KOMPLETTSCHUTZ_2019",
                "basicRiskType": "KOMPLETTSCHUTZ",
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
                "applicationCode": "GU WG DE KS 0419",
                "backgroundStyle": "secondary",
                "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test2.jpg",
                "defaultPaymentInterval": "monthly"
            }
        ]
    }
}