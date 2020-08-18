const request = require('supertest');
const app = require('../../../src/app');
const testhelper = require('../../helper/fixtureHelper');
const webservicesProductOffersAssembler = require('../../../src/backends/webservices/webservicesProductOffersAssembler');
const mockPhoneWebservicesClient = require('../../../test/helpers/webserviceMockClient').createMockWebserviceClientWithPhoneConfig();
const mockBikeWebservicesClient = require('../../../test/helpers/webserviceMockClient').createMockWebserviceClientWithBikeConfig();

beforeAll(() => {
    process.env = Object.assign(process.env, {BACKEND: "webservices"});
});

test('should return proper product data', async () => {
    const clientData = await testhelper.createAndPersistPhoneClientWithWebservicesConfiguration();
    const productOffers = await webservicesProductOffersAssembler.updateAllProductOffersForClient(clientData, undefined, mockPhoneWebservicesClient);

    const expectedStatusCode = 200;
    const result = await request(app).put(`/wertgarantie/ecommerce/clients/${clientData.publicClientIds[0]}/components/selection-embedded`).send({
        deviceClass: "Test",
        devicePrice: 90000
    });

    expect(result.status).toBe(expectedStatusCode);
    expect(result.body.products).toEqual([
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
            "productImageLink": "productImageLink",
            "backgroundStyle": "primary",
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
            "productImageLink": "productImageLink",
            "backgroundStyle": "secondary",
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
    ]);
});

describe("should add, update and delete product from shopping cart on product selection click", () => {
    let clientData;
    let productOffers;
    let signedShoppingCart;
    it("should update product in existing shopping cart", async () => {
        clientData = await testhelper.createAndPersistBikeClientWithWebservicesConfiguration();
        productOffers = await webservicesProductOffersAssembler.updateAllProductOffersForClient(clientData, undefined, mockBikeWebservicesClient);
        signedShoppingCart = testhelper.createSignedShoppingCart({
            publicClientId: clientData.publicClientIds[0],
            wertgarantieProductId: productOffers[0].id
        });
        const orderToChange = signedShoppingCart.shoppingCart.orders[0];
        const result = await request(app).post(`/wertgarantie/ecommerce/clients/${clientData.publicClientIds[0]}/components/selection-embedded/product`).send({
            orderId: orderToChange.id,
            shopProduct: {
                deviceClass: orderToChange.shopProduct.deviceClass,
                name: orderToChange.shopProduct.name,
                orderItemId: orderToChange.shopProduct.orderItemId,
                price: orderToChange.shopProduct.price
            },
            wertgarantieProduct: {
                deviceClass: "27",
                id: productOffers[0].id,
                name: "Fahrrad-Komplettschutz mit jährlicher Zahlweise",
                paymentInterval: "yearly",
                price: 2340,
                shopDeviceClass: "Bike"
            },
            signedShoppingCart: signedShoppingCart
        });
        expect(result.body.signedShoppingCart.shoppingCart.orders.length).toEqual(1);
        expect(result.body.signedShoppingCart.shoppingCart.orders[0].wertgarantieProduct).toEqual({
            deviceClass: "27",
            id: productOffers[0].id,
            name: "Fahrrad-Komplettschutz mit jährlicher Zahlweise",
            paymentInterval: "yearly",
            price: 2340,
            shopDeviceClass: "Bike"
        });
        expect(result.body.signedShoppingCart.signature).not.toEqual(signedShoppingCart.signature);
    });

    it("should delete product from existing shopping cart", async () => {
        clientData = await testhelper.createAndPersistBikeClientWithWebservicesConfiguration();
        productOffers = await webservicesProductOffersAssembler.updateAllProductOffersForClient(clientData, undefined, mockBikeWebservicesClient);
        signedShoppingCart = testhelper.createSignedShoppingCart({
            publicClientId: clientData.publicClientIds[0],
            wertgarantieProductId: productOffers[0].id
        });
        const result = await request(app).delete(`/wertgarantie/ecommerce/clients/${clientData.publicClientIds[0]}/components/selection-embedded/product`).send({
            orderId: signedShoppingCart.shoppingCart.orders[0].id,
            signedShoppingCart: signedShoppingCart
        });
        expect(result.status).toEqual(204);
    });
});