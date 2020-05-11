const request = require('supertest');
const app = require('../../../src/app');
const testhelper = require('../../helper/fixtureHelper');
const nockhelper = require('../../helper/nockHelper');

test('should return proper product data', async () => {
    const clientData = await testhelper.createAndPersistDefaultClient();
    const signedShoppingCart = testhelper.createSignedShoppingCart({
        publicClientData: clientData.publicClientIds[0],
        deviceClass: "Test",
        devicePrice: 120000
    });

    nockhelper.nockHeimdallLogin(clientData);
    nockhelper.getNockedHeimdallProductOffers(signedShoppingCart, clientData);

    const expectedStatusCode = 200;
    const result = await request(app).get('/wertgarantie/components/selection-popup').query({
        deviceClass: "Test",
        devicePrice: 120000,
        clientId: clientData.publicClientIds[0],
    });

    expect(result.status).toBe(expectedStatusCode);
    expect(result.body).toEqual({
        "products": [
            {
                "GTCIText": "Allgemeine Versicherungsbedingungen",
                "GTCIUri": "https://heimdall-stg-04.wertgarantie.com/download/9f1506a9-65e9-467c-a8d0-8f7ccd47d75b",
                "IPIDText": "Informationsblatt für Versicherungsprodukte",
                "IPIDUri": "https://heimdall-stg-04.wertgarantie.com/download/1eb7d0ce-6c62-4264-a3e7-58319bd4d4d1",
                "advantages": [
                    {
                        "text": "Volle Kostenübernahme bei Reparaturen",
                        "included": true
                    },
                    {
                        "text": "Bei Totalschaden zählt der Zeitwert",
                        "included": true
                    },
                    {
                        "text": "Für private und berufliche Nutzung",
                        "included": true
                    },
                    {
                        "text": "Weltweiter Schutz",
                        "included": true
                    },
                    {
                        "text": "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte",
                        "included": true
                    },
                    {
                        "text": "Unsachgemäße Handhabung",
                        "included": true
                    }
                ],
                "id": "1",
                "imageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png",
                "name": "Basis",
                "paymentInterval": "monatl.",
                "priceFormatted": "5,00 €",
                "taxFormatted": "(inkl. 0,80 € VerSt**)",
                "top3": [
                    {
                        "text": "Für private und berufliche Nutzung",
                        "included": true
                    },
                    {
                        "text": "Unsachgemäße Handhabung",
                        "included": true
                    },
                    {
                        "text": "Weltweiter Schutz",
                        "included": true
                    }
                ]
            },
            {
                "GTCIText": "Allgemeine Versicherungsbedingungen",
                "GTCIUri": "https://heimdall-stg-04.wertgarantie.com/download/9f1506a9-65e9-467c-a8d0-8f7ccd47d75b",
                "IPIDText": "Informationsblatt für Versicherungsprodukte",
                "IPIDUri": "https://heimdall-stg-04.wertgarantie.com/download/1eb7d0ce-6c62-4264-a3e7-58319bd4d4d1",
                "advantages": [
                    {
                        "text": "Volle Kostenübernahme bei Reparaturen",
                        "included": true
                    },
                    {
                        "text": "Bei Totalschaden zählt der Zeitwert",
                        "included": true
                    },
                    {
                        "text": "Für private und berufliche Nutzung",
                        "included": true
                    },
                    {
                        "text": "Weltweiter Schutz",
                        "included": true
                    },
                    {
                        "text": "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte",
                        "included": true
                    },
                    {
                        "text": "Unsachgemäße Handhabung",
                        "included": true
                    }
                ],
                "id": "2",
                "imageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png",
                "name": "Premium",
                "paymentInterval": "monatl.",
                "priceFormatted": "5,00 €",
                "taxFormatted": "(inkl. 0,80 € VerSt**)",
                "top3": [
                    {
                        "text": "Für private und berufliche Nutzung",
                        "included": true
                    },
                    {
                        "text": "Unsachgemäße Handhabung",
                        "included": true
                    },
                    {
                        "text": "Weltweiter Schutz",
                        "included": true
                    }
                ]
            }
        ],
        "texts": {
            "cancelButtonText": "Nein, danke",
            "confirmButtonText": "Versicherung hinzufügen",
            "detailsHeader": "Weitere Vorteile:",
            "footerHtml": "Versicherung ist Vertrauenssache, deshalb setzt testclient neben <strong>500.000 zufriedener Kunden</strong> auf die <strong>Wertgarantie</strong>, den <strong>Testsieger in Sachen Sicherheit</strong>",
            "hideDetailsText": "Details ausblenden",
            "partnerShop": "testclient",
            "showDetailsText": "Details anzeigen",
            "subtitle": "Wählen Sie die Versicherung aus, die Ihnen zusagt",
            "furtherInformation": "Weitere Informationen:",
            "title": "Vergessen Sie nicht Ihren Rundumschutz",
            "wertgarantieFurtherInfoHtml": "Mehr zur <a target=\"_blank\" href=\"%s\">Wertgarantie</a>",
            "documents": {
                "GTCI": "Allgemeine Versicherungsbedingungen",
                "IPID": "Informationsblatt für Versicherungsprodukte",
                "PIS": "Produktinformationsblatt",
                "GDPR": "Datenschutz",
                "ROW": "Widerrufsrecht"
            },
            "productTexts": {
                "paymentIntervals": {
                    "monthly": "monatl.",
                    "quarterly": "vierteljährl.",
                    "halfYearly": "habljährl.",
                    "yearly": "jährl."
                },
                "taxInformation": "(inkl. %s VerSt**)"
            }
        }
    });
});