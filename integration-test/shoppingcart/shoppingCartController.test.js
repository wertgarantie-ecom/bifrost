const request = require('supertest');
const app = require('../../src/app');
const testhelper = require('../helper/fixtureHelper');
const signatureService = require('../../src/shoppingcart/signatureService');
const uuid = require('uuid');
const nockhelper = require('../helper/nockHelper');

test('should return shopping cart with selected product included', async () => {
    const client = await testhelper.createAndPersistDefaultClient();

    const result = await request(app).post('/wertgarantie/shoppingCart/' + client.publicClientIds[0])
        .send({
            "productId": 12,
            "deviceClass": "17fd707a-f9c0-11e9-9694-cf549fcf64e2",
            "devicePrice": 4500,
            "deviceCurrency": "EUR",
            "shopProductName": "Phone X"
        });
    expect(result.status).toBe(200);

    const shoppingCart = result.body.signedShoppingCart.shoppingCart;
    expect(shoppingCart.products.length).toBe(1);
    expect(shoppingCart.legalAgeConfirmed).toBe(false);
    expect(shoppingCart.termsAndConditionsConfirmed).toBe(false);
    expect(shoppingCart.products[0].deviceClass).toEqual("17fd707a-f9c0-11e9-9694-cf549fcf64e2");
});

test('should fail when invalid request params are submitted', async () => {
    return request(app).post('/wertgarantie/shoppingCart/43446A56-3546-416D-B942-1262CA0526FB')
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
        const wertgarantieShoppingCart =
            {
                "sessionId": sessionId + "",
                "clientId": clientData.publicClientIds[0],
                "products": [
                    {
                        "wertgarantieProductId": wertgarantieProductId,
                        "wertgarantieProductName": wertgarantieProductName,
                        "deviceClass": "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                        "devicePrice": 139999,
                        "deviceCurrency": "EUR",
                        "shopProductName": "SuperBike 3000",
                        "orderId": "ef6ab539-13d8-451c-b8c3-aa2c498f8e46"
                    }
                ],
                "legalAgeConfirmed": true,
                "termsAndConditionsConfirmed": true
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

        const result = await request(app).post("/wertgarantie/shoppingCarts/current/checkout")
            .send({
                purchasedProducts: [{
                    price: 139999,
                    manufacturer: "Super Bike Inc.",
                    deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                    model: "SuperBike 3000"
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
        expect(body.clientId).toEqual(clientData.publicClientIds[0]);
        expect(purchase.wertgarantieProductId).toEqual("10");
        expect(purchase.wertgarantieProductName).toEqual(wertgarantieProductName);
        expect(purchase.deviceClass).toEqual("6bdd2d93-45d0-49e1-8a0c-98eb80342222");
        expect(purchase.devicePrice).toEqual(139999);
        expect(purchase.success).toBe(true);
        expect(purchase.message).toEqual("successfully transmitted insurance proposal");
        expect(purchase.shopProduct).toEqual("SuperBike 3000");
        expect(purchase.contractNumber).toEqual("1234");
        expect(purchase.transactionNumber).toEqual("28850277");
        expect(purchase.activationCode).toEqual("4db56dacfbhce");
        done();
    });

    test("should find checkout data by session id", async (done) => {
        const result = await request(app).get("/wertgarantie/purchases/" + sessionId);
        expect(result.status).toBe(200);
        const body = result.body;
        const purchase = body.purchases[0];
        expect(body.sessionId).toEqual(sessionId);
        expect(body.clientId).toEqual(clientData.publicClientIds[0]);
        expect(purchase.wertgarantieProductId).toEqual(10);
        expect(purchase.wertgarantieProductName).toEqual("Basic");
        expect(purchase.deviceClass).toEqual("6bdd2d93-45d0-49e1-8a0c-98eb80342222");
        expect(purchase.devicePrice).toEqual(139999);
        expect(purchase.success).toBe(true);
        expect(purchase.message).toEqual("successfully transmitted insurance proposal");
        expect(purchase.shopProduct).toEqual("SuperBike 3000");
        expect(purchase.contractNumber).toEqual(1234);
        expect(purchase.transactionNumber).toEqual(28850277);
        expect(purchase.activationCode).toEqual("4db56dacfbhce");
        done();
    });
});

test("should handle empty wertgarantieShoppingCart with info message", (done) => {
    return request(app).post("/wertgarantie/shoppingCarts/current/checkout")
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
    const result = await request(app).post("/wertgarantie/shoppingCarts/current/checkout")
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