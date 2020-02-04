const request = require('supertest');
const app = require('../../src/app');
const nock = require('nock');
const dateformat = require('dateformat');
const unknownDeviceClassResponse = require('./heimdallResponses').unknownDeviceClassResponse;
const testhelper = require('../helper/fixtureHelper');
const nockhelper = require('../helper/nockHelper');

test('should return proper product data', async () => {
    const clientData = await testhelper.createDefaultClient();
    const signedShoppingCart = testhelper.createSignedShoppingCart({clientId: clientData.publicClientIds[0], deviceClass: "fbfb2d44-4ff8-4579-9cc0-0a3ccb8d6f2d", devicePrice: 120000});

    nockhelper.nockLogin(clientData);
    nockhelper.getNockedProductOffers(signedShoppingCart);

    const expectedStatusCode = 200;
    const result = await request(app).get('/wertgarantie/components/selection-popup').query({
        deviceClass: "fbfb2d44-4ff8-4579-9cc0-0a3ccb8d6f2d",
        devicePrice: 120000,
        clientId: clientData.publicClientIds[0] + "",
    });

    expect(result.status).toBe(expectedStatusCode);
    expect(result.body).toEqual({
        "title": "Vergessen Sie nicht Ihren Rundumschutz",
        "products": [
            {
                "id": 1,
                "name": "Basis",
                "top3": [
                    "Für private und berufliche Nutzung",
                    "Unsachgemäße Handhabung",
                    "Weltweiter Schutz"
                ],
                "advantages": [
                    "Volle Kostenübernahme bei Reparaturen",
                    "Bei Totalschaden zählt der Zeitwert",
                    "Für private und berufliche Nutzung",
                    "Weltweiter Schutz",
                    "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte",
                    "Unsachgemäße Handhabung"
                ],
                "excludedAdvantages": [],
                "infoSheetText": "Rechtsdokumente",
                "infoSheetUri": "https://stage-api.wertgarantie.com/download/82e38762-4440-46a9-a34e-58974a3ddad5",
                "detailsDocText": "Informationsblatt für Versicherungsprodukte",
                "detailsDocUri": "https://stage-api.wertgarantie.com/download/1eb7d0ce-6c62-4264-a3e7-58319bd4d4d1",
                "paymentInterval": "monatl.",
                "price": "5,00",
                "currency": "€",
                "priceFormatted": "ab 5,00 €",
                "tax": "0,80",
                "taxFormatted": "(inkl. 0,80€ VerSt**)",
                "imageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png"
            }
        ]
    });
});