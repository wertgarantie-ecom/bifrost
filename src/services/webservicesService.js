

exports.getProductOffers = function getProductOffers() {
    // id --> uuid
};

exports.getWebservicesProductData = async function getWebservicesProductData() {

};

const webservicesServiceProductOffers = [
    {
        // pro Risk-Type-Kombination
        "id": "uuid",
        "productType": "KOMPLETTSCHUTZ_2019",
        "applicationCode": "GU WG BLA BLA",
        "riskTypes": [
            "KOMPLETTSCHUTZ"
        ],
        "name": "KOMPLETTSCHUTZ", //aus client config für Produkt --> selbst pflegen,
        "paymentInterval": "?",
        "advantages": ["ADVERTISING_TEXT"], // + was auch immer wir in der client config mit pflegen
        "deviceClasses": [
            {
                "objectCodeExternal": "Smartphone",
                "priceRanges": [
                    {
                        "minProductPrice": 0,
                        "maxProductPRice": 300,
                        "insurancePrime": 5,
                        "paymentInterval": 1 //monatl.
                    },
                    {
                        "minProductPrice": 301,
                        "maxProductPRice": 800,
                        "insurancePrime": 8,
                        "paymentInterval": 1 //monatl.
                    },
                    {
                        "minProductPrice": 801,
                        "maxProductPRice": 1800,
                        "insurancePrime": 11,
                        "paymentInterval": 1 //monatl.
                    },
                ],
            }
        ],
        "price": "INSURANCE_PREMIUM",
        "price_tax": "Selbst berechnen --> 19%?",
        "price_currency": "€", // unklar woher
        "price_formatted": "bekommen wir netto zurück? --> ab 5,00 €",
        "documents": [ // COMPARISON_DOCUMENT + LEGAL_DOCUMENTS
            {
                "document_type": "",
                "document_title": "",
                "document_link": ""
            },
            {
                "document_type": "",
                "document_title": "",
                "document_link": ""
            }
        ]
    },
    {
        // pro Risk-Type-Kombination
        "id": "uuid",
        "productType": "KOMPLETTSCHUTZ_2019",
        "applicationCode": "GU WG BLA BLA",
        "riskTypes": [
            "KOMPLETTSCHUTZ",
            "DIEBSTAHLSCHUTZ"
        ],
        "name": "KOMPLETTSCHUTZ MIT DIEBSTAHLSCHUTZ",
        "paymentInterval": "?",
        "advantages": ["ADVERTISING_TEXT"], // + was auch immer wir in der client config mit pflegen
        "deviceClasses": [
            {
                "objectCodeExternal": "Smartphone",
                "priceRanges": [
                    {
                        "minProductPrice": 0,
                        "maxProductPRice": 300,
                        "insurancePrime": 6.95,
                        "paymentInterval": 1 //monatl.
                    },
                    {
                        "minProductPrice": 301,
                        "maxProductPRice": 800,
                        "insurancePrime": 9.95,
                        "paymentInterval": 1 //monatl.
                    },
                    {
                        "minProductPrice": 801,
                        "maxProductPRice": 1800,
                        "insurancePrime": 12.95,
                        "paymentInterval": 1 //monatl.
                    },
                ],
            }
        ],
        "price": "INSURANCE_PREMIUM",
        "price_tax": "Selbst berechnen --> 19%?",
        "price_currency": "€", // unklar woher
        "price_formatted": "bekommen wir netto zurück? --> ab 5,00 €",
        "documents": [ // COMPARISON_DOCUMENT + LEGAL_DOCUMENTS
            {
                "document_type": "",
                "document_title": "",
                "document_link": ""
            },
            {
                "document_type": "",
                "document_title": "",
                "document_link": ""
            }
        ]

    }
];

const heimdallResponse = [
    {
        "id": 1,
        "premium": false,
        "name": "Basis",
        "description": null,
        "payment": "Monat",
        "suggest": false,
        "url": "https://www.wertgarantie.de/Home/Landingpage/komplettschutz.aspx",
        "utm_campaign": "offer-ks",
        "services": [],
        "advantages": [
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
        "special_advantages": [],
        "price": "5,00",
        "price_type": "ab",
        "price_currency": "€",
        "price_formatted": "ab 5,00 €",
        "price_tax": "0,80",
        "prices": {
            "monthly": {
                "price": "5,00",
                "price_type": "ab",
                "price_currency": "€",
                "price_formatted": "ab 5,00 €",
                "price_tax": "0,80"
            },
            "quarterly": {
                "price": "15,00",
                "price_type": "ab",
                "price_currency": "€",
                "price_formatted": "ab 15,00 €",
                "price_tax": "2,39"
            },
            "half_yearly": {
                "price": "30,00",
                "price_type": "ab",
                "price_currency": "€",
                "price_formatted": "ab 30,00 €",
                "price_tax": "4,79"
            },
            "yearly": {
                "price": "60,00",
                "price_type": "ab",
                "price_currency": "€",
                "price_formatted": "ab 60,00 €",
                "price_tax": "9,58"
            }
        },
        "documents": [
            {
                "document_title": "Rechtsdokumente",
                "document_file": "gu_wg_de_ks_0419_rechtsdokumente.pdf",
                "document_type": null,
                "document_link": "https://stage-api.wertgarantie.com/download/82e38762-4440-46a9-a34e-58974a3ddad5"
            },
            {
                "document_title": "Informationsblatt für Versicherungsprodukte",
                "document_file": "ipid.pdf",
                "document_type": "IPID",
                "document_link": "https://stage-api.wertgarantie.com/download/1eb7d0ce-6c62-4264-a3e7-58319bd4d4d1"
            },
            {
                "document_title": "Versicherungsschein",
                "document_file": "policy.pdf",
                "document_type": "POLICY",
                "document_link": "https://stage-api.wertgarantie.com/download/e725f5d0-a72c-4d00-9063-81753f191150"
            },
            {
                "document_title": "DSGVO Beileger",
                "document_file": "gdpr.pdf",
                "document_type": "GDPR",
                "document_link": "https://stage-api.wertgarantie.com/download/334e5b9b-0fb5-4a45-859e-ad0267a4431e"
            },
            {
                "document_title": "Allgemeine Versicherungsbedingungen",
                "document_file": "gpr.pdf",
                "document_type": "GTCI",
                "document_link": "https://stage-api.wertgarantie.com/download/9f1506a9-65e9-467c-a8d0-8f7ccd47d75b"
            },
            {
                "document_title": "SEPA Lastschriftmandat",
                "document_file": "komplettschutz_2019_sepa.pdf",
                "document_type": "SEPA",
                "document_link": "https://stage-api.wertgarantie.com/download/2954d934-884d-46c5-81a9-11e9e5c8fb19"
            },
            {
                "document_title": "Produktinformationsblatt",
                "document_file": "komplettschutz_2019_pis.pdf",
                "document_type": "PIS",
                "document_link": "https://stage-api.wertgarantie.com/download/b190b136-5d4f-43a0-b9f2-f1dd23348448"
            }
        ]
    },
    {
        "id": 4,
        "premium": true,
        "name": "Premium",
        "description": null,
        "payment": "Monat",
        "suggest": true,
        "url": "https://www.wertgarantie.de/Home/Landingpage/komplettschutz.aspx",
        "utm_campaign": "offer-ks-premium",
        "services": [],
        "advantages": [
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
        "special_advantages": [],
        "price": "6,95",
        "price_type": "ab",
        "price_currency": "€",
        "price_formatted": "ab 6,95 €",
        "price_tax": "1,11",
        "prices": {
            "monthly": {
                "price": "6,95",
                "price_type": "ab",
                "price_currency": "€",
                "price_formatted": "ab 6,95 €",
                "price_tax": "1,11"
            },
            "quarterly": {
                "price": "20,85",
                "price_type": "ab",
                "price_currency": "€",
                "price_formatted": "ab 20,85 €",
                "price_tax": "3,33"
            },
            "half_yearly": {
                "price": "41,70",
                "price_type": "ab",
                "price_currency": "€",
                "price_formatted": "ab 41,70 €",
                "price_tax": "6,66"
            },
            "yearly": {
                "price": "83,40",
                "price_type": "ab",
                "price_currency": "€",
                "price_formatted": "ab 83,40 €",
                "price_tax": "13,32"
            }
        },
        "documents": [
            {
                "document_title": "Rechtsdokumente",
                "document_file": "gu_wg_de_ks_0419_rechtsdokumente.pdf",
                "document_type": null,
                "document_link": "https://stage-api.wertgarantie.com/download/928e51ef-d92f-4aa4-ba42-61d1e100af2f"
            },
            {
                "document_title": "Informationsblatt für Versicherungsprodukte",
                "document_file": "ipid.pdf",
                "document_type": "IPID",
                "document_link": "https://stage-api.wertgarantie.com/download/191a36e2-6685-4a3d-beb0-dc0159a90387"
            },
            {
                "document_title": "Versicherungsschein",
                "document_file": "policy.pdf",
                "document_type": "POLICY",
                "document_link": "https://stage-api.wertgarantie.com/download/31473682-1c2e-4611-933c-1286a35a3399"
            },
            {
                "document_title": "DSGVO Beileger",
                "document_file": "gdpr.pdf",
                "document_type": "GDPR",
                "document_link": "https://stage-api.wertgarantie.com/download/b289b44e-b515-428f-8a26-4b1554a8c3bf"
            },
            {
                "document_title": "Allgemeine Versicherungsbedingungen",
                "document_file": "gpr.pdf",
                "document_type": "GTCI",
                "document_link": "https://stage-api.wertgarantie.com/download/5f6671a8-d1da-4668-a70a-f4f542f8a08a"
            },
            {
                "document_title": "SEPA Lastschriftmandat",
                "document_file": "komplettschutz_2019_sepa.pdf",
                "document_type": "SEPA",
                "document_link": "https://stage-api.wertgarantie.com/download/fab8b173-91d5-4fbd-a72b-c1f19f6e63d7"
            },
            {
                "document_title": "Allgemeine Versicherungsbedingungen",
                "document_file": "komplettschutz_2019_gtci.pdf",
                "document_type": "GTCI",
                "document_link": "https://stage-api.wertgarantie.com/download/00f90a1f-874a-4978-9d7f-ad6d09fb082c"
            },
            {
                "document_title": "Produktinformationsblatt",
                "document_file": "komplettschutz_2019_pis.pdf",
                "document_type": "PIS",
                "document_link": "https://stage-api.wertgarantie.com/download/0fd3b43b-164c-45ea-8e2f-9b6f35c57c81"
            }
        ]
    }
];