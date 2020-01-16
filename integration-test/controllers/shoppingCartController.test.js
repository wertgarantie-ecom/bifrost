const request = require('supertest');
const app = require('../../src/app');
const nock = require("nock");

test('should return cookie with selected product', async (done) => {
    await request(app).post('/wertgarantie/shoppingCart/43446A56-3546-416D-B942-1262CA0526FB')
        .send({
            "productId": 12,
            "deviceClass": "17fd707a-f9c0-11e9-9694-cf549fcf64e2",
            "devicePrice": 45.0,
            "deviceCurrency": "EUR",
            "shopProductName": "Phone X"
        })
        .expect(200)
        .expect('Set-Cookie', /clientId/)
        .expect('Set-Cookie', /products/);
    done();
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


describe('should be able to retrieve cookies', function () {
    const agent = request.agent(app);
    it('should set cookie in response', function (done) {
        agent.post('/wertgarantie/shoppingCart/43446A56-3546-416D-B942-1262CA0526FB')
            .send({
                "productId": 12,
                "deviceClass": "17fd707a-f9c0-11e9-9694-cf549fcf64e2",
                "devicePrice": 45.0,
                "deviceCurrency": "EUR",
                "shopProductName": "Phone X"
            })
            .expect('Set-Cookie', /products/, done);
    });

    it('should retrieve cookie', function (done) {
        agent.get('/wertgarantie/shoppingCart')
            .expect(function (res) {
                res.body["43446A56-3546-416D-B942-1262CA0526FB"].products[0].productId = 12;
                res.body["43446A56-3546-416D-B942-1262CA0526FB"].products[0].deviceClass = "17fd707a-f9c0-11e9-9694-cf549fcf64e2";
                res.body["43446A56-3546-416D-B942-1262CA0526FB"].products[0].devicePrice = 45.0;
                res.body["43446A56-3546-416D-B942-1262CA0526FB"].products[0].deviceCurrency = "EUR";
                res.body["43446A56-3546-416D-B942-1262CA0526FB"].products[0].shopProductName = "Phone X"
            })
            .expect(200, done);
    })
});

describe("Checkout Shopping Cart", () => {
    test("should checkout shopping cart", () => {
        const wertgarantieProductId = `10`;

        nock(process.env.HEIMDALL_URI)
            .post("/api/v1/products/" + wertgarantieProductId + "/checkout")
            .reply(200, {
                payload: {
                    contract_number: "1234",
                    transaction_number: "28850277",
                    activation_code: "4db56dacfbhce",
                    message: "Der Versicherungsantrag wurde erfolgreich übermittelt."
                }
            });

        return request(app).post("/wertgarantie/shoppingCarts/current/checkout")
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
                wertgarantieShoppingCart: `{
                    "shoppingCart": {
                      "sessionId": "7578f388-d79f-40e4-a969-50f9748f2c22",
                      "clientId": "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
                      "products": [
                        {
                          "wertgarantieProductId": ${wertgarantieProductId},
                          "deviceClass": "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                          "devicePrice": 139999,
                          "deviceCurrency": "EUR",
                          "shopProductName": "SuperBike 3000",
                          "orderId": "ef6ab539-13d8-451c-b8c3-aa2c498f8e46"
                        }
                      ],
                      "confirmed": true
                    },
                    "signature": "1jO75iRQJCE9L5hXwqcj7RWM7dbRa7mGTVwVsETIcJA="
                  }`,
                secretClientId: "bikesecret1"
            })
            .expect(200)
            .expect((result) => {
                const body = result.body;
                const purchase = body.purchases[0];
                expect(body.sessionId).toEqual("7578f388-d79f-40e4-a969-50f9748f2c22");
                expect(body.clientId).toEqual("5209d6ea-1a6e-11ea-9f8d-778f0ad9137f");
                expect(purchase.wertgarantieProductId).toEqual(10);
                expect(purchase.deviceClass).toEqual("6bdd2d93-45d0-49e1-8a0c-98eb80342222");
                expect(purchase.devicePrice).toEqual(139999);
                expect(purchase.success).toBe(true);
                expect(purchase.message).toEqual("successfully transmitted insurance proposal");
                expect(purchase.shopProduct).toEqual("SuperBike 3000");
                expect(purchase.contractNumber).toEqual("1234");
                expect(purchase.transactionNumber).toEqual("28850277");
                expect(purchase.activationCode).toEqual("4db56dacfbhce");
            });

    });

    test("should find checkout data by session id", () => {
        return request(app).get("/wertgarantie/purchases/7578f388-d79f-40e4-a969-50f9748f2c22")
            .expect(200)
            .expect((result) => {
                const body = result.body;
                const purchase = body.purchases[0];
                expect(body.sessionId).toEqual("7578f388-d79f-40e4-a969-50f9748f2c22");
                expect(body.clientId).toEqual("5209d6ea-1a6e-11ea-9f8d-778f0ad9137f");
                expect(purchase.wertgarantieProductId).toEqual(10);
                expect(purchase.deviceClass).toEqual("6bdd2d93-45d0-49e1-8a0c-98eb80342222");
                expect(purchase.devicePrice).toEqual(139999);
                expect(purchase.success).toBe(true);
                expect(purchase.message).toEqual("successfully transmitted insurance proposal");
                expect(purchase.shopProduct).toEqual("SuperBike 3000");
                expect(purchase.contractNumber).toEqual(1234);
                expect(purchase.transactionNumber).toEqual(28850277);
                expect(purchase.activationCode).toEqual("4db56dacfbhce");
            });
    });
});