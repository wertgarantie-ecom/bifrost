const documentTypes = require('../src/documents/documentTypes').documentTypes;
const request = require('supertest');
const app = require('../src/app');
const features = require('../src/handbook/features');

const phoneClientId = "433295ef-ec5d-45d2-8701-d530e44fcf88";
const bocClientId = "ad0a99e6-a165-4eda-91fc-564fb3f935b4";
const handFlashClientId = "9302410c-fbbe-44e3-a628-0d42d3944078";
const ceClientId = "e544fad2-c290-11ea-b918-b3bb267064b0";

describe('add phone test shop client config', () => {

    test('should add phone test shop client configuration', async () => {
        const validData = {
            "id": phoneClientId,
            "name": "Test Shop Handy",
            "email": "wertgarantie.bifrost@gmail.com",
            "backends": {
                "webservices": {
                    "username": "test-phone-user",
                    "password": "test-phone-password",
                    "productOffersConfigurations": [
                        {
                            "name": "Komplettschutz mit Premium-Option",
                            "backgroundStyle": "primary",
                            "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test2.jpg",
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
                                },
                                {
                                    "minClose": 0,
                                    "maxOpen": 180000,
                                    "condition": "USED"
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
                                    documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                    documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,
                                    documentTypes.GENERAL_DATA_PROTECTION_REGULATION,
                                    documentTypes.RIGHT_OF_WITHDRAWAL
                                ]
                            },
                            "advantages": [
                                "Diebstahl? Wir erstatten den Zeitwert!",
                                "Keine Selbstbeteiligung im Schadensfall",
                                "Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten",
                                "Displaybruch? Wir kümmern uns um die Reparatur und Kosten!",
                                "Bei Totalschaden zählt der Zeitwert",
                                "Für private und berufliche Nutzung",
                                "Volle Kostenübernahme bei Reparaturen (inkl. Fall- und Sturzschäden, Display- und Bruchschäden, Bedienfehlern, Motor-Lagerschäden, Wasserschäden, Elektronikschäden, Verkalkung, Verschleiß, uvm.)",
                                "Weltweiter Schutz",
                                "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte",
                                "Unsachgemäße Handhabung",
                                "Wasserschaden",
                            ],
                            "risks": ["DIEBSTAHLSCHUTZ"]
                        },
                        {
                            "name": "Komplettschutz",
                            "backgroundStyle": "secondary",
                            "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test3.jpg",
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
                                },
                                {
                                    "minClose": 0,
                                    "maxOpen": 180000,
                                    "condition": "USED"
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
                                    documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                    documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,
                                    documentTypes.GENERAL_DATA_PROTECTION_REGULATION,
                                    documentTypes.RIGHT_OF_WITHDRAWAL
                                ]
                            },
                            "advantages": [
                                "Displaybruch? Wir kümmern uns um die Reparatur und Kosten!",
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
                },
            },
            "activePartnerNumber": 11111,
            "secrets": [
                "secret:test-phone-secret"
            ],
            "publicClientIds": [
                "public:5209d6ea-1a6e-11ea-9f8d-778f0ad9137f"
            ],
            "basicAuthUser": "testshophandy",
            "basicAuthPassword": "testshophandy",
            "loaderConfig": [
                {
                    "name": "selection-pop-up",
                    "sources": {
                        "js": "http://localhost:3334/packages/package-selection-popup/dist/selection-popup.min.js"
                    },
                    "target": {
                        "pageSelector": "/shoppingCart",
                        "parentElementSelector": "body"
                    }
                },
                {
                    "name": "selection-embedded",
                    "sources": {
                        "js": "http://localhost:3334/packages/package-selection-embedded/dist/selection-embedded.min.js"
                    },
                    "target": {
                        "pageSelector": "/nothing",
                        "parentElementSelector": ".embedded-selection-placeholder"
                    }
                },
                {
                    "name": "confirmation",
                    "sources": {
                        "js": "http://localhost:3334/packages/package-confirmation/dist/confirmation.min.js"
                    },
                    "target": {
                        "pageSelector": "/shoppingCart",
                        "parentElementSelector": ".confirmation-container",
                        "validation": {
                            "inputSelector": "#checkout-form",
                            "event": "submit"
                        }
                    }
                },
                {
                    "name": "after-sales",
                    "sources": {
                        "js": "http://localhost:3334/packages/package-after-sales/dist/after-sales.min.js"
                    },
                    "target": {
                        "pageSelector": "/checkout",
                        "parentElementSelector": "body"
                    }
                }
            ],
            "conditionsMapping": [
                {
                    "shopCondition": "0",
                    "bifrostCondition": "NEW"
                },
                {
                    "shopCondition": "11",
                    "bifrostCondition": "USED"
                },
                {
                    "shopCondition": "12",
                    "bifrostCondition": "USED"
                },
                {
                    "shopCondition": "13",
                    "bifrostCondition": "USED"
                }
            ]
        };

        const response = await request(app)
            .get(`/wertgarantie/clients/${validData.id}`)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
            .set('Accept', 'application/json')
            .send(validData);

        if (response.status !== 200) {
            await request(app)
                .post("/wertgarantie/clients")
                .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
                .set('Accept', 'application/json')
                .send(validData)
                .expect(200);
        }
    });
});

describe('add ce test shop client config', () => {

    test('should add ce test shop client configuration', async () => {
        const validData = {
            "id": ceClientId,
            "name": "Test Shop CE",
            "email": "wertgarantie.bifrost@gmail.com",
            "backends": {
                "webservices": {
                    "username": "test-ce-user",
                    "password": "test-ce-password",
                    "productOffersConfigurations": [
                        {
                            "name": "Komplettschutz mit Premium-Option",
                            "backgroundStyle": "primary",
                            "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/CE/ce_auswahl_02.jpg",
                            "shortName": "Premiumschutz",
                            "productType": "KOMPLETTSCHUTZ_2019",
                            "applicationCode": "GU WG DE KS 0419",
                            "basicRiskType": "KOMPLETTSCHUTZ",
                            "defaultPaymentInterval": "monthly",
                            "priceRanges": [
                                {
                                    "minClose": 0,
                                    "maxOpen": 100001
                                },
                                {
                                    "minClose": 100001,
                                    "maxOpen": 1000001
                                }
                            ],
                            "deviceClasses": [
                                {
                                    "objectCode": "25",
                                    "objectCodeExternal": "366"
                                },
                                {
                                    "objectCode": "26",
                                    "objectCodeExternal": "208"
                                },
                                {
                                    "objectCode": "30",
                                    "objectCodeExternal": "130"
                                },
                                {
                                    "objectCode": "30",
                                    "objectCodeExternal": "5052"
                                },
                                {
                                    "objectCode": "37",
                                    "objectCodeExternal": "322"
                                },
                                {
                                    "objectCode": "38",
                                    "objectCodeExternal": "426"
                                },
                                {
                                    "objectCode": "39",
                                    "objectCodeExternal": "423"
                                },
                                {
                                    "objectCode": "53",
                                    "objectCodeExternal": "332"
                                },
                                {
                                    "objectCode": "53",
                                    "objectCodeExternal": "5080"
                                },
                                {
                                    "objectCode": "53",
                                    "objectCodeExternal": "4983"
                                },
                                {
                                    "objectCode": "56",
                                    "objectCodeExternal": "315"
                                },
                                {
                                    "objectCode": "59",
                                    "objectCodeExternal": "190"
                                },
                                {
                                    "objectCode": "60",
                                    "objectCodeExternal": "5271"
                                },
                                {
                                    "objectCode": "61",
                                    "objectCodeExternal": "5271"
                                },
                                {
                                    "objectCode": "72",
                                    "objectCodeExternal": "105"
                                },
                                {
                                    "objectCode": "76",
                                    "objectCodeExternal": "5272"
                                },
                                {
                                    "objectCode": "77",
                                    "objectCodeExternal": "371"
                                },
                                {
                                    "objectCode": "88",
                                    "objectCodeExternal": "5261"
                                },
                                {
                                    "objectCode": "89",
                                    "objectCodeExternal": "346"
                                },
                                {
                                    "objectCode": "91",
                                    "objectCodeExternal": "255"
                                },
                                {
                                    "objectCode": "97",
                                    "objectCodeExternal": "164"
                                },
                                {
                                    "objectCode": "9026",
                                    "objectCodeExternal": "4692"
                                },
                                {
                                    "objectCode": "9026",
                                    "objectCodeExternal": "4961"
                                },
                                {
                                    "objectCode": "59005",
                                    "objectCodeExternal": "219"
                                },
                                {
                                    "objectCode": "59005",
                                    "objectCodeExternal": "5060"
                                }
                            ],
                            "documents": {
                                "legalDocuments": [
                                    documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                    documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,
                                    documentTypes.GENERAL_DATA_PROTECTION_REGULATION,
                                    documentTypes.RIGHT_OF_WITHDRAWAL
                                ]
                            },
                            "advantages": [
                                "Diebstahlschutz",
                                "ohne Selbstbeteiligung",
                                "Cyberschutz",
                                "Materialfehler",
                                "Konstruktionsfehler",
                                "Produktionsfehler",
                                "Arbeitslohn, Ersatzteile, Fahrt- bzw. Versandkosten",
                                "Ersatzleistung bei Totalschaden",
                                "Unsachgemäße Handhabung",
                                "Wasser- / Feuchtigkeitsschäden",
                                "Überspannung",
                                "Elektronikschäden",
                                "Fall- und Sturzschäden",
                                "Display- / Panel- / Glaskeramik-Bruch",
                                "Originalzubehör / Fernbedienung im Hersteller-Lieferumfang",
                                "TV-Einstellarbeiten bei anbieterseitiger Kanalwechsel",
                                "TV-Software-Updates",
                                "Verschleiß / Verkalkung",
                                "Akku-Defekte"
                            ],
                            "risks": ["DIEBSTAHLSCHUTZ"]
                        },
                        {
                            "name": "Komplettschutz",
                            "backgroundStyle": "secondary",
                            "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/CE/ce_auswahl_01.jpg",
                            "shortName": "Basisschutz",
                            "productType": "KOMPLETTSCHUTZ_2019",
                            "applicationCode": "GU WG DE KS 0419",
                            "basicRiskType": "KOMPLETTSCHUTZ",
                            "defaultPaymentInterval": "monthly",
                            "priceRanges": [
                                {
                                    "minClose": 0,
                                    "maxOpen": 100001
                                },
                                {
                                    "minClose": 100001,
                                    "maxOpen": 1000001
                                }
                            ],
                            "deviceClasses": [
                                {
                                    "objectCode": "25",
                                    "objectCodeExternal": "366"
                                },
                                {
                                    "objectCode": "26",
                                    "objectCodeExternal": "208"
                                },
                                {
                                    "objectCode": "30",
                                    "objectCodeExternal": "130"
                                },
                                {
                                    "objectCode": "30",
                                    "objectCodeExternal": "5052"
                                },
                                {
                                    "objectCode": "37",
                                    "objectCodeExternal": "322"
                                },
                                {
                                    "objectCode": "38",
                                    "objectCodeExternal": "426"
                                },
                                {
                                    "objectCode": "39",
                                    "objectCodeExternal": "423"
                                },
                                {
                                    "objectCode": "53",
                                    "objectCodeExternal": "332"
                                },
                                {
                                    "objectCode": "53",
                                    "objectCodeExternal": "5080"
                                },
                                {
                                    "objectCode": "53",
                                    "objectCodeExternal": "4983"
                                },
                                {
                                    "objectCode": "56",
                                    "objectCodeExternal": "315"
                                },
                                {
                                    "objectCode": "59",
                                    "objectCodeExternal": "190"
                                },
                                {
                                    "objectCode": "60",
                                    "objectCodeExternal": "5271"
                                },
                                {
                                    "objectCode": "61",
                                    "objectCodeExternal": "5271"
                                },
                                {
                                    "objectCode": "72",
                                    "objectCodeExternal": "105"
                                },
                                {
                                    "objectCode": "76",
                                    "objectCodeExternal": "5272"
                                },
                                {
                                    "objectCode": "77",
                                    "objectCodeExternal": "371"
                                },
                                {
                                    "objectCode": "88",
                                    "objectCodeExternal": "5261"
                                },
                                {
                                    "objectCode": "89",
                                    "objectCodeExternal": "346"
                                },
                                {
                                    "objectCode": "91",
                                    "objectCodeExternal": "255"
                                },
                                {
                                    "objectCode": "97",
                                    "objectCodeExternal": "164"
                                },
                                {
                                    "objectCode": "9026",
                                    "objectCodeExternal": "4692"
                                },
                                {
                                    "objectCode": "9026",
                                    "objectCodeExternal": "4961"
                                },
                                {
                                    "objectCode": "59005",
                                    "objectCodeExternal": "219"
                                },
                                {
                                    "objectCode": "59005",
                                    "objectCodeExternal": "5060"
                                }
                            ],
                            "documents": {
                                "legalDocuments": [
                                    documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                    documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,
                                    documentTypes.GENERAL_DATA_PROTECTION_REGULATION,
                                    documentTypes.RIGHT_OF_WITHDRAWAL
                                ]
                            },
                            "advantages": [
                                "Materialfehler",
                                "Konstruktionsfehler",
                                "Produktionsfehler",
                                "Arbeitslohn, Ersatzteile, Fahrt- bzw. Versandkosten",
                                "Ersatzleistung bei Totalschaden",
                                "Unsachgemäße Handhabung",
                                "Wasser- / Feuchtigkeitsschäden",
                                "Überspannung",
                                "Elektronikschäden",
                                "Fall- und Sturzschäden",
                                "Display- / Panel- / Glaskeramik-Bruch",
                                "Originalzubehör / Fernbedienung im Hersteller-Lieferumfang",
                                "TV-Einstellarbeiten bei anbieterseitiger Kanalwechsel",
                                "TV-Software-Updates",
                                "Verschleiß / Verkalkung",
                                "Akku-Defekte"
                            ],
                            "risks": []
                        }
                    ]
                },
            },
            "activePartnerNumber": 11111,
            "secrets": [
                "secret:test-ce-secret"
            ],
            "publicClientIds": [
                "public:76b31bb2-c4f7-11ea-9487-6fcbeb12db26"
            ],
            "basicAuthUser": "testshopce",
            "basicAuthPassword": "testshopce",
            "loaderConfig": [
                {
                    "name": "selection-pop-up",
                    "sources": {
                        "js": "http://localhost:3334/packages/package-selection-popup/dist/selection-popup.min.js"
                    },
                    "target": {
                        "pageSelector": "/shoppingCart",
                        "parentElementSelector": "body"
                    }
                },
                {
                    "name": "selection-embedded",
                    "sources": {
                        "js": "http://localhost:3334/packages/package-selection-embedded/dist/selection-embedded.min.js"
                    },
                    "target": {
                        "pageSelector": "/nothing",
                        "parentElementSelector": ".embedded-selection-placeholder"
                    }
                },
                {
                    "name": "confirmation",
                    "sources": {
                        "js": "http://localhost:3334/packages/package-confirmation/dist/confirmation.min.js"
                    },
                    "target": {
                        "pageSelector": "/shoppingCart",
                        "parentElementSelector": ".confirmation-container",
                        "validation": {
                            "inputSelector": "#checkout-form",
                            "event": "submit"
                        }
                    }
                },
                {
                    "name": "after-sales",
                    "sources": {
                        "js": "http://localhost:3334/packages/package-after-sales/dist/after-sales.min.js"
                    },
                    "target": {
                        "pageSelector": "/checkout",
                        "parentElementSelector": "body"
                    }
                }
            ]
        };

        const response = await request(app)
            .get(`/wertgarantie/clients/${validData.id}`)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
            .set('Accept', 'application/json')
            .send(validData);

        if (response.status !== 200) {
            await request(app)
                .post("/wertgarantie/clients")
                .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
                .set('Accept', 'application/json')
                .send(validData)
                .expect(200);
        }
    });
});

describe('add bike test shop client config', () => {
    test('should add bike test shop client configuration', async (done) => {

        const validData = {
            "id": bocClientId,
            "name": "Test Shop Bike",
            "backends": {
                "webservices": {
                    "username": "test-bike-user",
                    "password": "test-bike-password",
                    "productOffersConfigurations": [
                        {
                            "name": "Fahrrad-Komplettschutz mit monatlicher Zahlweise",
                            "backgroundStyle": "primary",
                            "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Bike/fahrrad_1.jpg",
                            "shortName": "Variante A",
                            "productType": "KOMPLETTSCHUTZ_RAD_M_2018",
                            "applicationCode": "GU WG DE RAD KS 0818",
                            "basicRiskType": "KOMPLETTSCHUTZ_RAD",
                            "defaultPaymentInterval": "monthly",
                            "priceRanges": [
                                {
                                    "minClose": 0,
                                    "maxOpen": 50001
                                },
                                {
                                    "minClose": 50001,
                                    "maxOpen": 75001
                                },
                                {
                                    "minClose": 75001,
                                    "maxOpen": 100001
                                },
                                {
                                    "minClose": 100001,
                                    "maxOpen": 150001
                                },
                                {
                                    "minClose": 150001,
                                    "maxOpen": 200001
                                },
                                {
                                    "minClose": 200001,
                                    "maxOpen": 400000
                                }
                            ],
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
                            "deviceClasses": [
                                {
                                    "objectCode": "27",
                                    "objectCodeExternal": "Bike",
                                }

                            ],
                            "documents": {
                                "legalDocuments": [
                                    documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                    documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,
                                    documentTypes.GENERAL_DATA_PROTECTION_REGULATION,
                                    documentTypes.RIGHT_OF_WITHDRAWAL
                                ]
                            },
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
                            "risks": []
                        },
                        {
                            "name": "Fahrrad-Komplettschutz mit jährlicher Zahlweise",
                            "backgroundStyle": "secondary",
                            "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Bike/fahrrad_2.jpg",
                            "shortName": "Variante B",
                            "productType": "KOMPLETTSCHUTZ_RAD_J_2018",
                            "applicationCode": "GU WG DE RAD KS 0818",
                            "basicRiskType": "KOMPLETTSCHUTZ_RAD",
                            "defaultPaymentInterval": "yearly",
                            "priceRanges": [
                                {
                                    "minClose": 0,
                                    "maxOpen": 50001
                                },
                                {
                                    "minClose": 50001,
                                    "maxOpen": 75001
                                },
                                {
                                    "minClose": 75001,
                                    "maxOpen": 100001
                                },
                                {
                                    "minClose": 100001,
                                    "maxOpen": 150001
                                },
                                {
                                    "minClose": 150001,
                                    "maxOpen": 200001
                                },
                                {
                                    "minClose": 200001,
                                    "maxOpen": 400000
                                }
                            ],
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
                            "deviceClasses": [
                                {
                                    "objectCode": "27",
                                    "objectCodeExternal": "Bike",
                                }

                            ],
                            "documents": {
                                "legalDocuments": [
                                    documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                    documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,
                                    documentTypes.GENERAL_DATA_PROTECTION_REGULATION,
                                    documentTypes.RIGHT_OF_WITHDRAWAL
                                ]
                            },
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
                            "risks": []
                        },
                        {
                            "name": "E-Bike-Komplettschutz mit monatlicher Zahlweise",
                            "backgroundStyle": "primary",
                            "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/E-Bike/ebike_1.jpg",
                            "shortName": "Variante A",
                            "productType": "KOMPLETTSCHUTZ_EBIKE_M_2018",
                            "applicationCode": "GU WG DE RAD EBS 0818",
                            "basicRiskType": "KOMPLETTSCHUTZ_EBIKE",
                            "defaultPaymentInterval": "monthly",
                            "priceRanges": [
                                {
                                    "minClose": 0,
                                    "maxOpen": 150001
                                },
                                {
                                    "minClose": 150001,
                                    "maxOpen": 300001
                                },
                                {
                                    "minClose": 300001,
                                    "maxOpen": 400001
                                },
                                {
                                    "minClose": 400001,
                                    "maxOpen": 600000
                                }
                            ],
                            "lock": {
                                "priceRanges": [
                                    {
                                        "maxOpen": 600001,
                                        "minClose": 0,
                                        "requiredLockPrice": 4900
                                    }
                                ]
                            },
                            "deviceClasses": [
                                {
                                    "objectCode": "270009",
                                    "objectCodeExternal": "E-Bike",
                                }

                            ],
                            "documents": {
                                "legalDocuments": [
                                    documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                    documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,
                                    documentTypes.GENERAL_DATA_PROTECTION_REGULATION,
                                    documentTypes.RIGHT_OF_WITHDRAWAL
                                ]
                            },
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
                            "risks": []
                        }, {
                            "name": "E-Bike-Komplettschutz mit jährlicher Zahlweise",
                            "backgroundStyle": "secondary",
                            "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/E-Bike/ebike_2.jpg",
                            "shortName": "Variante B",
                            "productType": "KOMPLETTSCHUTZ_EBIKE_J_2018",
                            "applicationCode": "GU WG DE RAD EBS 0818",
                            "basicRiskType": "KOMPLETTSCHUTZ_EBIKE",
                            "defaultPaymentInterval": "yearly",
                            "priceRanges": [
                                {
                                    "minClose": 0,
                                    "maxOpen": 150001
                                },
                                {
                                    "minClose": 150001,
                                    "maxOpen": 300001
                                },
                                {
                                    "minClose": 300001,
                                    "maxOpen": 400001
                                },
                                {
                                    "minClose": 400001,
                                    "maxOpen": 600000
                                }
                            ],
                            "lock": {
                                "priceRanges": [
                                    {
                                        "maxOpen": 600001,
                                        "minClose": 0,
                                        "requiredLockPrice": 4900
                                    }
                                ]
                            },
                            "deviceClasses": [
                                {
                                    "objectCode": "270009",
                                    "objectCodeExternal": "E-Bike",
                                }

                            ],
                            "documents": {
                                "legalDocuments": [
                                    documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                    documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,
                                    documentTypes.GENERAL_DATA_PROTECTION_REGULATION,
                                    documentTypes.RIGHT_OF_WITHDRAWAL
                                ]
                            },
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
                            "risks": []
                        }
                    ]
                }
            },
            "activePartnerNumber": 22222,
            "secrets": [
                "secret:test-bike-secret"
            ],
            "publicClientIds": [
                "public:5a576bd2-1953-4d20-80de-4de00d65fdc7"
            ],
            "basicAuthUser": "testshopbike",
            "basicAuthPassword": "testshopbike",
            "handbook": {
                "features": features,
                "components": {
                    selectionpopup: {
                        sample: "www.example.com"
                    },
                    confirmation: {
                        sample: "www.example.com"
                    },
                    aftersales: {
                        sample: "www.example.com"
                    }

                }
            },
            "loaderConfig": [
                {
                    "name": "selection-pop-up",
                    "sources": {
                        "js": "http://localhost:3334/packages/package-selection-popup/dist/selection-popup.min.js"
                    },
                    "target": {
                        "pageSelector": "/shoppingCart",
                        "parentElementSelector": "body"
                    }
                },
                {
                    "name": "selection-embedded",
                    "sources": {
                        "js": "http://localhost:3334/packages/package-selection-embedded/dist/selection-embedded.min.js"
                    },
                    "target": {
                        "pageSelector": "/nothing",
                        "parentElementSelector": ".embedded-selection-placeholder"
                    }
                },
                {
                    "name": "confirmation",
                    "sources": {
                        "js": "http://localhost:3334/packages/package-confirmation/dist/confirmation.min.js"
                    },
                    "target": {
                        "pageSelector": "/shoppingCart",
                        "parentElementSelector": ".confirmation-container",
                        "validation": {
                            "inputSelector": "#checkout-form",
                            "event": "submit"
                        }
                    }
                },
                {
                    "name": "after-sales",
                    "sources": {
                        "js": "http://localhost:3334/packages/package-after-sales/dist/after-sales.min.js"
                    },
                    "target": {
                        "pageSelector": "/checkout",
                        "parentElementSelector": "body"
                    }
                }
            ]
        };

        const response = await request(app)
            .get(`/wertgarantie/clients?publicClientId=${validData.publicClientIds[0]}`)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
            .set('Accept', 'application/json')
            .send(validData);

        console.log(JSON.stringify(response.body, null, 2));
        if (response.status !== 200) {
            await request(app)
                .post("/wertgarantie/clients")
                .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
                .set('Accept', 'application/json')
                .send(validData)
                .expect(200);
        }
        done();
    })
});

describe('add Handyflash Local test client config', () => {
    test('should add Handyflash Local test client configuration', async (done) => {
        const validData = {
            "id": handFlashClientId,
            "name": "Handyflash Local",
            "backends": {
                "webservices": {
                    "username": "test-handyflash-user",
                    "password": "test-handyflash-password",
                    "productOffersConfigurations": [
                        {
                            "name": "Komplettschutz mit Premium-Option",
                            "backgroundStyle": "primary",
                            "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test2.jpg",
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
                                    "objectCodeExternal": "Smartphone",
                                },
                                {
                                    "objectCode": "73",
                                    "objectCodeExternal": "Mobilfunk",
                                }

                            ],
                            "documents": {
                                "legalDocuments": [
                                    documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                    documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,
                                    documentTypes.GENERAL_DATA_PROTECTION_REGULATION,
                                    documentTypes.RIGHT_OF_WITHDRAWAL
                                ]
                            },
                            "advantages": [
                                "Diebstahl? Wir erstatten den Zeitwert!",
                                "Keine Selbstbeteiligung im Schadensfall",
                                "Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten",
                                "Displaybruch? Wir kümmern uns um die Reparatur und Kosten!",
                                "Bei Totalschaden zählt der Zeitwert",
                                "Für private und berufliche Nutzung",
                                "Volle Kostenübernahme bei Reparaturen (inkl. Fall- und Sturzschäden, Display- und Bruchschäden, Bedienfehlern, Motor-Lagerschäden, Wasserschäden, Elektronikschäden, Verkalkung, Verschleiß, uvm.)",
                                "Weltweiter Schutz",
                                "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte",
                                "Unsachgemäße Handhabung",
                                "Wasserschaden"
                            ],
                            "risks": ["DIEBSTAHLSCHUTZ"]
                        },
                        {
                            "name": "Komplettschutz",
                            "backgroundStyle": "secondary",
                            "productImageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test.jpg",
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
                                    "objectCodeExternal": "Smartphone",
                                },
                                {
                                    "objectCode": "73",
                                    "objectCodeExternal": "Mobilfunk",
                                }
                            ],
                            "documents": {
                                "legalDocuments": [
                                    documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                    documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,
                                    documentTypes.GENERAL_DATA_PROTECTION_REGULATION,
                                    documentTypes.RIGHT_OF_WITHDRAWAL
                                ]
                            },
                            "advantages": [
                                "Displaybruch? Wir kümmern uns um die Reparatur und Kosten!",
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
            },
            "activePartnerNumber": 33333,
            "secrets": [
                "secret:test-handyflash-secret"
            ],
            "publicClientIds": [
                "public:b9f303d0-74e1-11ea-b9e9-034d1bd36e8d"
            ],
            "basicAuthUser": "handyflash-dev",
            "basicAuthPassword": "handyflash-dev",
            "loaderConfig": [
                {
                    "name": "selection-pop-up",
                    "sources": {
                        "js": "http://localhost:3334/packages/package-selection-popup/dist/selection-popup.min.js"
                    },
                    "target": {
                        "pageSelector": "/shoppingCart",
                        "parentElementSelector": "body"
                    }
                },
                {
                    "name": "selection-embedded",
                    "sources": {
                        "js": "http://localhost:3334/packages/package-selection-embedded/dist/selection-embedded.min.js"
                    },
                    "target": {
                        "pageSelector": "/nothing",
                        "parentElementSelector": ".embedded-selection-placeholder"
                    }
                },
                {
                    "name": "confirmation",
                    "sources": {
                        "js": "http://localhost:3334/packages/package-confirmation/dist/confirmation.min.js"
                    },
                    "target": {
                        "pageSelector": "/shoppingCart",
                        "parentElementSelector": ".confirmation-container",
                        "validation": {
                            "inputSelector": "#checkout-form",
                            "event": "submit"
                        }
                    }
                },
                {
                    "name": "after-sales",
                    "sources": {
                        "js": "http://localhost:3334/packages/package-after-sales/dist/after-sales.min.js"
                    },
                    "target": {
                        "pageSelector": "/checkout",
                        "parentElementSelector": "body"
                    }
                }
            ]
        };

        const response = await request(app)
            .get(`/wertgarantie/clients?publicClientId=${validData.publicClientIds[0]}`)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
            .set('Accept', 'application/json')
            .send(validData);

        console.log(JSON.stringify(response.body, null, 2));
        if (response.status !== 200) {
            await request(app)
                .post("/wertgarantie/clients")
                .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
                .set('Accept', 'application/json')
                .send(validData)
                .expect(200);
        }
        done();
    });
})


test("update product offers for all clients", async (done) => {
    await request(app).post(`/wertgarantie/productOffers`)
        .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD);
    done();
});

