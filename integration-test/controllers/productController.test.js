const request = require('supertest');
const app = require('../../src/app');
const nock = require('nock');
const getProductOffersResponse = require('./heimdallResponses').getProductOffersResponse;
const unknownDeviceClassResponse = require('./heimdallResponses').unknownDeviceClassResponse;
const testhelper = require('../helper/fixtureHelper');
const dateformat = require('dateformat');

test('should return proper product data', async () => {
    const clientData = await testhelper.createDefaultClient();
    const date = new Date(2020, 1, 1);

    nock(process.env.HEIMDALL_URI)
        .get("/api/v1/auth/client/" + clientData.secrets[0])
        .reply(200, {
            payload: {
                access_token: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjVmMjk1NzQ2ZjE5Mzk3OTZmYmMzMjYxm..."
            }
        });

        nock(process.env.HEIMDALL_URI)
        .get("/api/v1/product-offers?device_class=fbfb2d44-4ff8-4579-9cc0-0a3ccb8d6f2d&device_purchase_price=1200&device_purchase_date=" + dateformat(date, 'yyyy-mm-dd'))
        .reply(200, getProductOffersResponse);

    const expectedStatusCode = 200;
    return await request(app).get('/wertgarantie/components/selection-popup').query({
        deviceClass: "fbfb2d44-4ff8-4579-9cc0-0a3ccb8d6f2d",
        devicePrice: 1200,
        productId: 11,
        clientId: clientData.publicClientIds[0] + "",
    })
        .expect(function (res) {
            if (res.status !== expectedStatusCode) {
                console.log(JSON.stringify(res.body, null, 2));
            }
        })
        .expect(expectedStatusCode)
        .expect({
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
        })

});

test('should throw error if device class does not exist', async () => {
    nock(process.env.HEIMDALL_URI)
        .get("/api/v1/auth/client/bikesecret1")
        .reply(200, {
            payload: {
                access_token: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjVmMjk1NzQ2ZjE5Mzk3OTZmYmMzMjYxm..."
            }
        });

    const date = new Date().toLocaleDateString();

    nock(process.env.HEIMDALL_URI)
        .get("/api/v1/product-offers?device_class=fda71hf6-4ff8-4579-9cc0-0a3ccb8d6f2e&device_purchase_price=1200&device_purchase_date=" + date)
        .reply(400, unknownDeviceClassResponse);
    const expectedStatusCode = 400;
    return await request(app).get('/wertgarantie/components/selection-popup').query({
        deviceClass: "fda71hf6-4ff8-4579-9cc0-0a3ccb8d6f2e",
        devicePrice: 1200,
        productId: 11
    })
        .expect(function (res) {
            if (res.status !== expectedStatusCode) {
                console.log(JSON.stringify(res.body, null, 2));
            }
        })
        .expect(expectedStatusCode)
        .expect(400)
});