const request = require('supertest');
const app = require('../../src/app');
const testhelper = require('../helper/fixtureHelper');
const uuid = require('uuid');
const webservicesProductOffersAssembler = require('../../src/backends/webservices/webservicesProductOffersAssembler');
const webserviceMockClientWithPhoneConfig = require('../../test/helpers/webserviceMockClient').createMockWebserviceClientWithPhoneConfig();

test('should return shopping cart with selected product included', async () => {
    const client = await testhelper.createAndPersistPhoneClientWithWebservicesConfiguration();
    const productOffers = await webservicesProductOffersAssembler.updateAllProductOffersForClient(client, undefined, webserviceMockClientWithPhoneConfig);
    const orderItemId = uuid();
    const result = await request(app).post(`/wertgarantie/ecommerce/clients/${client.publicClientIds[0]}/shoppingCart`)
        .send({
            shopProduct: {
                name: "Phone X",
                price: 4500,
                deviceClass: "Smartphone",
                orderItemId: orderItemId
            },
            wertgarantieProduct: {
                id: productOffers[0].id,
                name: "Komplettschutz",
                paymentInterval: "monthly",
                deviceClass: "9025",
                shopDeviceClass: "Smartphone",
                price: 500
            }
        });
    expect(result.status).toBe(200);

    const shoppingCart = result.body.signedShoppingCart.shoppingCart;
    expect(shoppingCart.orders.length).toBe(1);
    expect(shoppingCart.confirmations.termsAndConditionsConfirmed).toBe(false);
    expect(shoppingCart.orders[0].shopProduct.deviceClass).toEqual("Smartphone");
    expect(shoppingCart.orders[0].shopProduct.orderItemId).toEqual(orderItemId);
});

test('should fail when invalid request params are submitted', async () => {
    const client = await testhelper.createAndPersistDefaultClient();
    return request(app).post(`/wertgarantie/ecommerce/clients/${client.publicClientIds[0]}/shoppingCart`)
        .send({
            "productId": 12,
            "devicePrice": 45.0,
            "deviceCurrency": "EUR",
            "shopProductName": "Phone X"
        })
        .expect(400)
        .expect(function (res) {
            res.body.errors = "\"deviceClass\" is required"
        })
});

describe("Checkout Shopping Cart", () => {
});

test("should handle empty wertgarantieShoppingCart with info message", (done) => {
    return request(app).post("/wertgarantie/ecommerce/shoppingCarts/current/checkout")
        .send({
            purchasedProducts: [],
            customer: {
                company: "INNOQ",
                salutation: "Herr",
                firstname: "Max",
                lastname: "Mustermann",
                street: "Unter den Linden",
                zip: "52345",
                city: "Köln",
                country: "Deutschland",
                email: "max.mustermann1234@test.com"
            },
            secretClientId: "bikesecret1",
            wertgarantieShoppingCart: ""
        })
        .expect(200)
        .expect({
            message: `No Wertgarantie products were provided for checkout call. In this case, the API call to Wertgarantie-Bifrost is not needed.`
        }, done);
});

test("should handle invalid JSON in wertgarantieShoppingCart with status 400", async () => {
    const result = await request(app).post("/wertgarantie/ecommerce/shoppingCarts/current/checkout")
        .send({
            purchasedProducts: [],
            customer: {
                company: "INNOQ",
                salutation: "Herr",
                firstname: "Max",
                lastname: "Mustermann",
                street: "Unter den Linden",
                zip: "52345",
                city: "Köln",
                country: "Deutschland",
                email: "max.mustermann1234@test.com"
            },
            secretClientId: "bikesecret1",
            signedShoppingCart: "{'name': 'Alex'"
        });

    expect(result.status).toBe(400);
});

test("should add multiple orders to shopping cart", async () => {
    const client = await testhelper.createAndPersistPhoneClientWithWebservicesConfiguration();
    const productOffers = await webservicesProductOffersAssembler.updateAllProductOffersForClient(client, undefined, webserviceMockClientWithPhoneConfig);
    const signedShoppingCart = testhelper.createSignedShoppingCart();
    const result = await request(app).post(`/wertgarantie/ecommerce/clients/${client.publicClientIds[0]}/shoppingCart`)
        .send({
            shopProduct: {
                name: "Phone X",
                price: 4500,
                deviceClass: "Smartphone, Kühlschrank"
            },
            wertgarantieProduct: {
                id: productOffers[0].id,
                name: "Komplettschutz",
                paymentInterval: "monthly",
                deviceClass: "9025",
                shopDeviceClass: "Smartphone",
                price: 500
            },
            signedShoppingCart: signedShoppingCart
        });

    expect(result.body.signedShoppingCart.shoppingCart.orders.length).toBe(2);
});