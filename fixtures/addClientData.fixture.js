const documentTypes = require('../src/documents/documentTypes').documentTypes;
const request = require('supertest');
const app = require('../src/app');

const phoneClientId = "433295ef-ec5d-45d2-8701-d530e44fcf88";
const bikeClientId = "ad0a99e6-a165-4eda-91fc-564fb3f935b4";
const handFlashClientId = "9302410c-fbbe-44e3-a628-0d42d3944078";

describe('add phone test shop client config', () => {

    test('should add phone test shop client configuration', async () => {
        const validData = {
            "id": phoneClientId,
            "name": "Test Shop Handy",
            "email": "wertgarantie.bifrost@gmail.com",
            "backends": {
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
                    "username": "test-phone-user",
                    "password": "test-phone-password",
                    "productOffersConfigurations": [
                        {
                            "name": "Komplettschutz mit Premium-Option",
                            "shorName": "Premiumschutz",
                            "productType": "KOMPLETTSCHUTZ_2019",
                            "applicationCode": "GU WG DE KS 0419",
                            "basicRiskType": "KOMPLETTSCHUTZ",
                            "defaultPaymentInterval": "monthly",
                            "deviceClasses": [
                                {
                                    "objectCode": "9025",
                                    "objectCodeExternal": "Smartphone",
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
                                    ]
                                },
                                {
                                    "objectCode": "73",
                                    "objectCodeExternal": "Mobilfunk",
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
                                    ]
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
                            "shorName": "Basisschutz",
                            "productType": "KOMPLETTSCHUTZ_2019",
                            "applicationCode": "GU WG DE KS 0419",
                            "basicRiskType": "KOMPLETTSCHUTZ",
                            "defaultPaymentInterval": "monthly",
                            "deviceClasses": [
                                {
                                    "objectCode": "9025",
                                    "objectCodeExternal": "Smartphone",
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
                                    ]
                                },
                                {
                                    "objectCode": "73",
                                    "objectCodeExternal": "Mobilfunk",
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
                                    ]
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
            "basicAuthPassword": "testshophandy"
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
            "id": bikeClientId,
            "name": "Test Shop Bike",
            "backends": {
                "heimdall": {
                    "clientId": "test-bike-heimdall-clientId",
                    "deviceClassMappings": [
                        {
                            "shopDeviceClass": "Bike",
                            "heimdallDeviceClass": "6bdd2d93-45d0-49e1-8a0c-98eb80342222"
                        }
                    ]
                },
                "webservices": {
                    "username": "test-bike-user",
                    "password": "test-bike-password",
                    "productOffersConfigurations": [
                        {
                            "name": "Fahrrad-Komplettschutz mit monatlicher Zahlweise",
                            "shortName": "Variante A",
                            "productType": "KOMPLETTSCHUTZ_RAD_M_2018",
                            "applicationCode": "GU WG DE RAD KS 0818",
                            "basicRiskType": "KOMPLETTSCHUTZ_RAD",
                            "defaultPaymentInterval": "monthly",
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
                                    ]
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
                            "shortName": "Variante B",
                            "productType": "KOMPLETTSCHUTZ_RAD_J_2018",
                            "applicationCode": "GU WG DE RAD KS 0818",
                            "basicRiskType": "KOMPLETTSCHUTZ_RAD",
                            "defaultPaymentInterval": "yearly",
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
                                    ]
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
                            "shortName": "Variante A",
                            "productType": "KOMPLETTSCHUTZ_EBIKE_M_2018",
                            "applicationCode": "GU WG DE RAD EBS 0818",
                            "basicRiskType": "KOMPLETTSCHUTZ_EBIKE",
                            "defaultPaymentInterval": "monthly",
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
                                    ]
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
                        },                        {
                            "name": "E-Bike-Komplettschutz mit jährlicher Zahlweise",
                            "shortName": "Variante B",
                            "productType": "KOMPLETTSCHUTZ_EBIKE_J_2018",
                            "applicationCode": "GU WG DE RAD EBS 0818",
                            "basicRiskType": "KOMPLETTSCHUTZ_EBIKE",
                            "defaultPaymentInterval": "yearly",
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
                                    ]
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
            "basicAuthPassword": "testshopbike"
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

describe('add Handyflash DEV/Local test client config', () => {
    test('should add Handyflash DEV test client configuration', async (done) => {
        const validData = {
            "id": handFlashClientId,
            "name": "Handyflash DEV",
            "backends": {
                "heimdall": {
                    "clientId": "test-handyflash-heimdall-clientId",
                    "deviceClassMappings": [
                        {
                            "shopDeviceClass": "Smartphone",
                            "heimdallDeviceClass": "1dfd4549-9bdc-4285-9047-e5088272dade"
                        }
                    ]
                },
                "webservices": {
                    "username": "test-handyflash-user",
                    "password": "test-handyflash-password",
                    "productOffersConfigurations": [
                        {
                            "name": "Komplettschutz mit Premium-Option",
                            "shorName": "Premiumschutz",
                            "productType": "KOMPLETTSCHUTZ_2019",
                            "applicationCode": "GU WG DE KS 0419",
                            "basicRiskType": "KOMPLETTSCHUTZ",
                            "defaultPaymentInterval": "monthly",
                            "deviceClasses": [
                                {
                                    "objectCode": "9025",
                                    "objectCodeExternal": "Smartphone",
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
                                    ]
                                },
                                {
                                    "objectCode": "73",
                                    "objectCodeExternal": "Mobilfunk",
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
                                    ]
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
                            "shorName": "Basisschutz",
                            "productType": "KOMPLETTSCHUTZ_2019",
                            "applicationCode": "GU WG DE KS 0419",
                            "basicRiskType": "KOMPLETTSCHUTZ",
                            "defaultPaymentInterval": "monthly",
                            "deviceClasses": [
                                {
                                    "objectCode": "9025",
                                    "objectCodeExternal": "Smartphone",
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
                                    ]
                                },
                                {
                                    "objectCode": "73",
                                    "objectCodeExternal": "Mobilfunk",
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
                                    ]
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
            "basicAuthPassword": "handyflash-dev"
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

