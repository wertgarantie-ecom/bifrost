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
    const result = await request(app).put(`/wertgarantie/ecommerce/clients/${clientData.publicClientIds[0]}/components/selection-popup`).send({
        deviceClass: "Test",
        devicePrice: 120000
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
                        "included": true,
                        "text": "Volle Kostenübernahme bei Reparaturen"
                    },
                    {
                        "included": true,
                        "text": "Bei Totalschaden zählt der Zeitwert"
                    },
                    {
                        "included": true,
                        "text": "Für private und berufliche Nutzung"
                    },
                    {
                        "included": true,
                        "text": "Weltweiter Schutz"
                    },
                    {
                        "included": true,
                        "text": "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte"
                    },
                    {
                        "included": true,
                        "text": "Unsachgemäße Handhabung"
                    }
                ],
                "id": "1",
                "imageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png",
                "intervalCode": "monthly",
                "name": "Basis",
                "paymentInterval": "monatl.",
                "price": 500,
                "priceFormatted": "5,00 €",
                "shopDeviceClass": "Test",
                "deviceClass": "Test",
                "taxFormatted": "(inkl. 0,80 € VerSt**)",
                "top3": [
                    {
                        "included": true,
                        "text": "Für private und berufliche Nutzung"
                    },
                    {
                        "included": true,
                        "text": "Unsachgemäße Handhabung"
                    },
                    {
                        "included": true,
                        "text": "Weltweiter Schutz"
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
                        "included": true,
                        "text": "Volle Kostenübernahme bei Reparaturen"
                    },
                    {
                        "included": true,
                        "text": "Bei Totalschaden zählt der Zeitwert"
                    },
                    {
                        "included": true,
                        "text": "Für private und berufliche Nutzung"
                    },
                    {
                        "included": true,
                        "text": "Weltweiter Schutz"
                    },
                    {
                        "included": true,
                        "text": "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte"
                    },
                    {
                        "included": true,
                        "text": "Unsachgemäße Handhabung"
                    }
                ],
                "id": "2",
                "imageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png",
                "intervalCode": "monthly",
                "name": "Premium",
                "paymentInterval": "monatl.",
                "price": 500,
                "priceFormatted": "5,00 €",
                "shopDeviceClass": "Test",
                "deviceClass": "Test",
                "taxFormatted": "(inkl. 0,80 € VerSt**)",
                "top3": [
                    {
                        "included": true,
                        "text": "Für private und berufliche Nutzung"
                    },
                    {
                        "included": true,
                        "text": "Unsachgemäße Handhabung"
                    },
                    {
                        "included": true,
                        "text": "Weltweiter Schutz"
                    }
                ]
            }
        ],
        "texts": {
            "cancelButtonText": "Nein, danke",
            "confirmButtonText": "Versicherung hinzufügen",
            "detailsHeader": "Weitere Vorteile:",
            "documents": {
                "GDPR": "Datenschutz",
                "GTCI": "Allgemeine Versicherungsbedingungen",
                "IPID": "Informationsblatt für Versicherungsprodukte",
                "PIS": "Produktinformationsblatt",
                "ROW": "Widerrufsrecht"
            },
            "footerHtml": "Versicherung ist Vertrauenssache, deshalb setzt testclient neben <strong>500.000 zufriedener Kunden</strong> auf die <strong>Wertgarantie</strong>, den <strong>Testsieger in Sachen Sicherheit</strong>",
            "furtherInformation": "Weitere Informationen:",
            "hideDetailsText": "Details ausblenden",
            "partnerShop": "testclient",
            "productTexts": {
                "paymentIntervals": {
                    "halfYearly": "habljährl.",
                    "monthly": "monatl.",
                    "quarterly": "vierteljährl.",
                    "yearly": "jährl."
                },
                "taxInformation": "(inkl. %s VerSt**)"
            },
            "showDetailsText": "Details anzeigen",
            "subtitle": "Wählen Sie die Versicherung aus, die Ihnen zusagt",
            "title": "Vergessen Sie nicht Ihren Wertgarantie Rundumschutz",
            "wertgarantieFurtherInfoHtml": "Mehr zur <a target=\"_blank\" href=\"%s\">Wertgarantie</a>"
        },
        "offeredOrderItemIds": []
    });
});

test('should return 204 if given orderItemId is already included in existing shoppingCart', async () => {

    const clientData = await testhelper.createAndPersistDefaultClient();
    const signedShoppingCart = testhelper.createSignedShoppingCart({
        publicClientData: clientData.publicClientIds[0],
        deviceClass: "Test",
        devicePrice: 120000
    });

    nockhelper.nockHeimdallLogin(clientData);
    nockhelper.getNockedHeimdallProductOffers(signedShoppingCart, clientData);

    const expectedStatusCode = 204;
    const result = await request(app).put(`/wertgarantie/ecommerce/clients/${clientData.publicClientIds[0]}/components/selection-popup`).send({
        signedShoppingCart: signedShoppingCart,
        deviceClass: "Test",
        devicePrice: 120000,
        orderItemId: signedShoppingCart.shoppingCart.orders[0].shopProduct.orderItemId
    });

    expect(result.status).toBe(expectedStatusCode);
})