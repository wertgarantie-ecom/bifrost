const request = require('supertest');
const uuid = require('uuid');
const app = require('../../src/app');

test('should return cookie with selected product', async () => {
    return request(app).post('/wertgarantie/shoppingCart/43446A56-3546-416D-B942-1262CA0526FB')
        .send({
            "productId": 12,
            "deviceClass": "17fd707a-f9c0-11e9-9694-cf549fcf64e2",
            "devicePrice": 45.0,
            "deviceCurrency": "EUR",
            "shopProductName": "Phone X"
        })
        .expect(200)
        .expect('Set-Cookie', /clientId/)
        .expect('Set-Cookie', /products/)
        .then(response => {
            console.log(response.body);
        })
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

test("should checkout shopping cart", async () => {
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
                  "clientId": "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
                  "products": [
                    {
                      "wertgarantieProductId": 10,
                      "deviceClass": "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                      "devicePrice": 139999,
                      "deviceCurrency": "EUR",
                      "shopProductName": "SuperBike 3000",
                      "orderId": "ef6ab539-13d8-451c-b8c3-aa2c498f8e46"
                    }
                  ],
                  "confirmed": true
                },
                "signature": "V4GmLZIvIjB/LdHkDxlry4B0v9DxHFOVCJ8pUcs04gQ="
              }`,
            secretClientId: "bikesecret1"
        })
        .expect(200)
        .then(response => {
            console.log(JSON.stringify(response.body, null, 2));
        });
});