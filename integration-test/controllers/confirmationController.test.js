const request = require('supertest');
const app = require('../../src/app');
const uuid = require('uuid');
const nock = require('nock');
const getProductOffersResponse = require('./heimdallResponses').getProductOffersResponse;
const testhelper = require('../helper/fixtureHelper');
const dateformat = require('dateformat');

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

describe('should return 204 on missing shopping cart cookie', function () {
    const agent = request.agent(app);
    it('get shopping cart data', function (done) {
        agent.get('/wertgarantie/components/confirmation?clientId=' + 12)
            .expect(204, done);
    });
});

describe("should return valid confirmation data", function () {
    let clientData;
    const agent = request.agent(app);

    it('setup test data', async () => {
        clientData = await testhelper.createDefaultClient();
        nock(process.env.HEIMDALL_URI)
            .get("/api/v1/auth/client/" + clientData.secrets[0])
            .reply(200, {
                payload: {
                    access_token: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjVmMjk1NzQ2ZjE5Mzk3OTZmYmMzMjYxm..."
                }
            });

        nock(process.env.HEIMDALL_URI)
            .get("/api/v1/product-offers?device_class=17fd707a-f9c0-11e9-9694-cf549fcf64e2&device_purchase_price=45&device_purchase_date=" + dateformat(new Date(), 'yyyy-mm-dd'))
            .reply(200, getProductOffersResponse);
    });

    it('create valid shopping cart', function (done) {
        agent.post('/wertgarantie/shoppingCart/' + clientData.publicClientIds[0])
            .send({
                "productId": 12,
                "deviceClass": "17fd707a-f9c0-11e9-9694-cf549fcf64e2",
                "devicePrice": 4500,
                "deviceCurrency": "EUR",
                "shopProductName": "Phone X"
            })
            .expect('Set-Cookie', /products/, done);
    });

    it('get shopping cart data', function (done) {
        agent.get('/wertgarantie/components/confirmation?clientId=' + clientData.publicClientIds[0], function (req, res) {
            req.cookie(clientData.publicClientIds[0])
        })
        .expect(200, done);
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
