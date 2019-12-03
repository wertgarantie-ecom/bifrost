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

test('should handle valid confirm cart request', async () => {
    const clientId = uuid();
    return request(app).put("/wertgarantie/shoppingCart/" + clientId + "/confirmation")
        .expect(400)
});

describe('should handle shopping cart confirmation', function () {
    const agent = request.agent(app);
    const clientId = uuid();
    createShoppingCart(agent, clientId);

    it('confirm shopping cart', function (done) {
        agent.put('/wertgarantie/shoppingCart/' + clientId + "/confirmation")
            .expect(200, done);
    });

    it('check confirmation', function (done) {
        agent.get('/wertgarantie/shoppingCart/')
            .expect(function (res) {
                if (res.body[clientId].confirmed !== true) {
                    console.log(res.body);
                    throw new Error("shopping cart not confirmed!")
                }
            })
            .expect(200, done);
    })
});

describe('should handle shopping cart confirmation rejection', function () {
    const agent = request.agent(app);
    const clientId = uuid();
    createShoppingCart(agent, clientId);

    it('confirm shopping cart', function (done) {
        agent.put('/wertgarantie/shoppingCart/' + clientId + "/confirmation")
            .expect(200, done);
    });

    it('unconfirm shopping cart', function (done) {
        agent.delete('/wertgarantie/shoppingCart/' + clientId + "/confirmation")
            .expect(200, done);
    });

    it('check confirmation', function (done) {
        agent.get('/wertgarantie/shoppingCart/')
            .expect(function (res) {
                if (res.body[clientId].confirmed === true) {
                    console.log(res.body);
                    throw new Error("shopping cart still confirmed!")
                }
            })
            .expect(200, done);
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

function createShoppingCart(agent, clientId) {
    it('create valid shopping cart', function (done) {
        agent.post('/wertgarantie/shoppingCart/' + clientId)
            .send({
                "productId": 12,
                "deviceClass": "17fd707a-f9c0-11e9-9694-cf549fcf64e2",
                "devicePrice": 45.0,
                "deviceCurrency": "EUR",
                "shopProductName": "Phone X"
            })
            .expect('Set-Cookie', /products/, done);
    });
}
