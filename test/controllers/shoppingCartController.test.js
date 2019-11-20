const request = require('supertest');
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
    .expect(function(res) {
        res.body.errors = "\"deviceClass\" is required"
    })
});
const expectedResponse = {
    "43446A56-3546-416D-B942-1262CA0526FB": {
        "clientId": "43446A56-3546-416D-B942-1262CA0526FB",
        "products": [
            {
                "productId": 12,
                "deviceClass": "17fd707a-f9c0-11e9-9694-cf549fcf64e2",
                "devicePrice": 45.0,
                "deviceCurrency": "EUR",
                "shopProductName": "Phone X"
            }
        ]
    }
}
describe('should be able to retrieve cookies', function () {
    const agent = request.agent(app);
    it('should set cookie in response', function(done) {
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

    it('should retrieve cookie', function(done) {
        agent.get('/wertgarantie/shoppingCart')
        .expect(JSON.stringify(expectedResponse), done);
    })
});
