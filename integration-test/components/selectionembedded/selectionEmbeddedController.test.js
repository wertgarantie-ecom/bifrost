const request = require('supertest');
const app = require('../../../src/app');
const testhelper = require('../../helper/fixtureHelper');
const webservicesProductOffersAssembler = require('../../../src/backends/webservices/webservicesProductOffersAssembler');
const mockWebservicesClient = require('../../../test/helpers/webserviceMockClient').createMockWebserviceClientWithPhoneConfig();

beforeAll(() => {
    process.env = Object.assign(process.env, {BACKEND: "webservices"});
});

test('should return proper product data', async () => {
    const clientData = await testhelper.createAndPersistPhoneClientWithWebservicesConfiguration();
    const productOffers = await webservicesProductOffersAssembler.updateAllProductOffersForClient(clientData, undefined, mockWebservicesClient);

    const expectedStatusCode = 200;
    const result = await request(app).put(`/wertgarantie/ecommerce/clients/${clientData.publicClientIds[0]}/components/selection-embedded`).send({
        deviceClass: "Test",
        devicePrice: 90000
    });

    expect(result.status).toBe(expectedStatusCode);
    expect(result.body.products).toEqual([
        {
            "GTCIText": "Allgemeine Versicherungsbedingungen",
            "GTCIUri": "undefined/wertgarantie/documents/9448f030d5684ed3d587aa4e6167a1fd918aa47b",
            "IPIDText": "Informationsblatt für Versicherungsprodukte",
            "IPIDUri": "undefined/wertgarantie/documents/8835ff3c803f3e7abc5d49527001678bb179cfaa",
            "advantages": [],
            "deviceClass": "73",
            "id": productOffers[0].id,
            "imageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png",
            "intervalCode": "monthly",
            "name": "Komplettschutz",
            "paymentInterval": "monatl.",
            "price": 2340,
            "priceFormatted": "23,40 €",
            "shopDeviceClass": "Test",
            "shortName": "Basisschutz",
            "taxFormatted": "(inkl. 3,74 € VerSt**)",
            "top3": [
                {
                    "included": true
                }
            ]
        },
        {
            "GTCIText": "Allgemeine Versicherungsbedingungen",
            "GTCIUri": "undefined/wertgarantie/documents/9448f030d5684ed3d587aa4e6167a1fd918aa47b",
            "IPIDText": "Informationsblatt für Versicherungsprodukte",
            "IPIDUri": "undefined/wertgarantie/documents/8835ff3c803f3e7abc5d49527001678bb179cfaa",
            "advantages": [],
            "deviceClass": "73",
            "id": productOffers[1].id,
            "imageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png",
            "intervalCode": "monthly",
            "name": "Komplettschutz mit Premium-Option",
            "paymentInterval": "monatl.",
            "price": 2340,
            "priceFormatted": "23,40 €",
            "shopDeviceClass": "Test",
            "shortName": "Premiumschutz",
            "taxFormatted": "(inkl. 3,74 € VerSt**)",
            "top3": [
                {
                    "included": true
                }
            ]
        }
    ]);
});