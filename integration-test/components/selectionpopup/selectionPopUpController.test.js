const request = require('supertest');
const app = require('../../../src/app');
const testHelper = require('../../helper/fixtureHelper');
const nockHelper = require('../../helper/nockHelper');
const webservicesProductOfferAssembler = require('../../../src/backends/webservices/webservicesProductOffersAssembler');
const mockWebservicesClient = require('../../../test/helpers/webserviceMockClient').createMockWebserviceClientWithPhoneConfig()

test('should return proper product data', async () => {
    const clientConfig = await testHelper.createAndPersistPhoneClientWithWebservicesConfiguration();

    const signedShoppingCart = testHelper.createSignedShoppingCart({
        publicClientData: clientConfig.publicClientIds[0],
        deviceClass: "Test",
        devicePrice: 120000
    });
    const productOffers = await webservicesProductOfferAssembler.updateAllProductOffersForClient(clientConfig, undefined, mockWebservicesClient);
    signedShoppingCart.shoppingCart.orders[0].wertgarantieProduct.id = productOffers[0].id;
    signedShoppingCart.shoppingCart.orders[0].wertgarantieProduct.name = productOffers[0].name;

    nockHelper.nockWebservicesLogin("123434");
    nockHelper.nockGetNewContractNumber("123234234");
    nockHelper.nockSubmitInsuranceProposal();

    const expectedStatusCode = 200;
    const result = await request(app).put(`/wertgarantie/ecommerce/clients/${clientConfig.publicClientIds[0]}/components/selection-popup`).send({
        deviceClass: "Test",
        devicePrice: 120000
    });

    expect(result.status).toBe(expectedStatusCode);
    expect(result.body).toEqual({
        "products": [
            {
                "GTCIText": "Allgemeine Versicherungsbedingungen",
                "GTCIUri": "http://localhost:3000/wertgarantie/documents/9448f030d5684ed3d587aa4e6167a1fd918aa47b",
                "IPIDText": "Informationsblatt für Versicherungsprodukte",
                "IPIDUri": "http://localhost:3000/wertgarantie/documents/8835ff3c803f3e7abc5d49527001678bb179cfaa",
                "advantages": [
                    {
                        "included": true,
                        "text": "advantage3"
                    }
                ],
                "deviceClass": "73",
                "id": productOffers[0].id,
                "imageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png",
                "intervalCode": "monthly",
                "name": "Komplettschutz",
                "paymentInterval": "monatl.",
                "price": 2340,
                "priceFormatted": "23,40 €",
                "shopDeviceClass": "Test",
                "taxFormatted": "(inkl. 3,74 € VerSt**)",
                "top3": [
                    {
                        "included": true,
                        "text": "advantage1"
                    },
                    {
                        "included": true,
                        "text": "advantage2"
                    },
                    {
                        "included": false,
                        "text": "advantage4"
                    }
                ]
            },
            {
                "GTCIText": "Allgemeine Versicherungsbedingungen",
                "GTCIUri": "http://localhost:3000/wertgarantie/documents/9448f030d5684ed3d587aa4e6167a1fd918aa47b",
                "IPIDText": "Informationsblatt für Versicherungsprodukte",
                "IPIDUri": "http://localhost:3000/wertgarantie/documents/8835ff3c803f3e7abc5d49527001678bb179cfaa",
                "advantages": [
                    {
                        "included": true,
                        "text": "advantage4"
                    }
                ],
                "deviceClass": "73",
                "id": productOffers[1].id,
                "imageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png",
                "intervalCode": "monthly",
                "name": "Komplettschutz mit Premium-Option",
                "paymentInterval": "monatl.",
                "price": 2340,
                "priceFormatted": "23,40 €",
                "shopDeviceClass": "Test",
                "taxFormatted": "(inkl. 3,74 € VerSt**)",
                "top3": [
                    {
                        "included": true,
                        "text": "advantage1"
                    },
                    {
                        "included": true,
                        "text": "advantage2"
                    },
                    {
                        "included": true,
                        "text": "advantage3"
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
            "footerHtml": "Versicherung ist Vertrauenssache, deshalb setzt testClient neben <strong>500.000 zufriedener Kunden</strong> auf die <strong>Wertgarantie</strong>, den <strong>Testsieger in Sachen Sicherheit</strong>",
            "furtherInformation": "Weitere Informationen:",
            "hideDetailsText": "Details ausblenden",
            "partnerShop": "testClient",
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
        }
    });
});

test('should return 204 if given orderItemId is already included in existing shoppingCart', async () => {

    const clientData = await testHelper.createAndPersistDefaultClient();
    const signedShoppingCart = testHelper.createSignedShoppingCart({
        publicClientData: clientData.publicClientIds[0],
        deviceClass: "Test",
        devicePrice: 120000
    });

    const expectedStatusCode = 204;
    const result = await request(app).put(`/wertgarantie/ecommerce/clients/${clientData.publicClientIds[0]}/components/selection-popup`).send({
        signedShoppingCart: signedShoppingCart,
        deviceClass: "Test",
        devicePrice: 120000,
        orderItemId: signedShoppingCart.shoppingCart.orders[0].shopProduct.orderItemId
    });

    expect(result.status).toBe(expectedStatusCode);
})