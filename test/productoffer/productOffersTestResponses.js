exports.productOffers = {
    "generalDocuments": [],
    "productOffers": [
        {
            "id": "9338a770-0d0d-4203-8d54-583a03bdebf3",
            "name": "Komplettschutz",
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
    ]
};

exports.productOffersWithoutDocuments = {
    "generalDocuments": [],
    "productOffers": [
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
    ]
};