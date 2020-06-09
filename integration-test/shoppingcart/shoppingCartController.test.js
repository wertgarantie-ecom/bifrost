const request = require('supertest');
const app = require('../../src/app');
const testhelper = require('../helper/fixtureHelper');
const signatureService = require('../../src/shoppingcart/signatureService');
const uuid = require('uuid');
const nockhelper = require('../helper/nockHelper');
const webservicesProductOffersAssembler = require('../../src/backends/webservices/webservicesProductOffersAssembler');
const webserviceMockClientWithPhoneConfig = require('../../test/helpers/webserviceMockClient').createMockWebserviceClientWithPhoneConfig();
const webserviceMockClientWithBikeConfig = require('../../test/helpers/webserviceMockClient').createMockWebserviceClientWithBikeConfig();

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
    let clientData;
    const sessionId = uuid();

    test("should checkout shopping cart", async (done) => {
        clientData = await testhelper.createAndPersistDefaultClient();
        const wertgarantieProductId = "10";
        const wertgarantieProductName = 'Basic';
        const wertgarantieShoppingCart = {
            sessionId: sessionId + "",
            publicClientId: clientData.publicClientIds[0],
            orders: [
                {
                    wertgarantieProduct: {
                        id: wertgarantieProductId,
                        name: wertgarantieProductName,
                        paymentInterval: "monthly"
                    },
                    shopProduct: {
                        deviceClass: "Bike",
                        price: 139999,
                        name: "SuperBike 3000",
                    },
                    id: "ef6ab539-13d8-451c-b8c3-aa2c498f8e46"
                }
            ],
            confirmations: {
                termsAndConditionsConfirmed: true
            }
        };

        nockhelper.nockHeimdallLogin(clientData);
        nockhelper.nockHeimdallCheckoutShoppingCart(wertgarantieProductId, {
            payload: {
                contract_number: "1234",
                transaction_number: "28850277",
                activation_code: "4db56dacfbhce",
                message: "Der Versicherungsantrag wurde erfolgreich übermittelt."
            }
        });

        const result = await request(app).post("/wertgarantie/ecommerce/shoppingCarts/current/checkout")
            .send({
                purchasedProducts: [{
                    price: 139999,
                    manufacturer: "Super Bike Inc.",
                    deviceClass: "Bike",
                    name: "SuperBike 3000"
                }],
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
                signedShoppingCart: signatureService.signShoppingCart(wertgarantieShoppingCart),
                secretClientId: clientData.secrets[0]
            });
        expect(result.status).toBe(200);
        const body = result.body;
        const purchase = body.purchases[0];
        expect(body.sessionId).toEqual(wertgarantieShoppingCart.sessionId);
        expect(purchase.wertgarantieProductId).toEqual("10");
        expect(purchase.wertgarantieProductName).toEqual(wertgarantieProductName);
        expect(purchase.deviceClass).toEqual("6bdd2d93-45d0-49e1-8a0c-98eb80342222");
        expect(purchase.devicePrice).toEqual(139999);
        expect(purchase.success).toBe(true);
        expect(purchase.message).toEqual("successfully transmitted insurance proposal");
        expect(purchase.backend).toEqual("heimdall");
        expect(purchase.shopProduct).toEqual("SuperBike 3000");
        expect(purchase.contractNumber).toEqual("1234");
        expect(purchase.transactionNumber).toEqual("28850277");
        expect(purchase.backend).toEqual("heimdall");
        expect(purchase.backendResponseInfo).toEqual({
            activationCode: "4db56dacfbhce"
        });
        done();
    });

    test("should find checkout data by session id", async (done) => {
        const result = await request(app).get("/wertgarantie/checkouts/" + sessionId);
        expect(result.status).toBe(200);
        const body = result.body;
        const purchase = body.purchases[0];
        expect(body.sessionId).toEqual(sessionId);
        expect(body.clientId).toEqual(clientData.id);
        expect(purchase.wertgarantieProductId).toEqual("10");
        expect(purchase.wertgarantieProductName).toEqual("Basic");
        expect(purchase.deviceClass).toEqual("6bdd2d93-45d0-49e1-8a0c-98eb80342222");
        expect(purchase.devicePrice).toEqual(139999);
        expect(purchase.success).toBe(true);
        expect(purchase.message).toEqual("successfully transmitted insurance proposal");
        expect(purchase.shopProduct).toEqual("SuperBike 3000");
        expect(purchase.contractNumber).toEqual("1234");
        expect(purchase.transactionNumber).toEqual("28850277");
        expect(purchase.backend).toEqual("heimdall");
        expect(purchase.backendResponseInfo).toEqual({
            activationCode: "4db56dacfbhce"
        });
        done();
    });
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
                deviceClass: "Smartphone"
            },
            wertgarantieProduct: {
                id: productOffers[0].id,
                name: "Komplettschutz",
                paymentInterval: "monthly",
                price: 500
            },
            signedShoppingCart: signedShoppingCart
        });

    expect(result.body.signedShoppingCart.shoppingCart.orders.length).toBe(2);
});