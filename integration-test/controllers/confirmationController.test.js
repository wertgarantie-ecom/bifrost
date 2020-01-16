const request = require('supertest');
const app = require('../../src/app');
const uuid = require('uuid');

test('should handle valid confirm cart request', async () => {
    const clientId = uuid();
    return request(app)
        .put("/wertgarantie/components/confirmation")
        .send({clientId: clientId})
        .set('Accept', 'application/json')
        .expect(400)
});

describe('should handle shopping cart confirmation', function () {
    const agent = request.agent(app);
    const clientId = uuid();
    createShoppingCart(agent, clientId);

    it('confirm shopping cart', function (done) {
        agent.put('/wertgarantie/components/confirmation')
            .send({clientId: clientId})
            .set('Accept', 'application/json')
            .expect(200, done);
    });

    it('check confirmation', function (done) {
        agent.get('/wertgarantie/shoppingCart/')
            .expect(function (res) {
                if (res.body[clientId].confirmed !== true) {
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
        agent.put('/wertgarantie/components/confirmation')
            .send({clientId: clientId})
            .set('Accept', 'application/json')
            .expect(200, done);
    });

    it('unconfirm shopping cart', function (done) {
        agent.delete('/wertgarantie/components/confirmation')
            .send({clientId: clientId})
            .set('Accept', 'application/json')
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

describe('should return 400 on missing shopping cart cookie', function () {
    const agent = request.agent(app);
    it('get shopping cart data', function (done) {
        agent.get('/wertgarantie/components/confirmation?clientId=' + 12)
            .expect(204, done);
    });
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
