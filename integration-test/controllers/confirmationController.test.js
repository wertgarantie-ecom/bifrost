const request = require('supertest');
const app = require('../../src/app');
const uuid = require('uuid');
const nock = require('nock');
const getProductOffersResponse = require('./heimdallResponses').getProductOffersResponse;
const testhelper = require('../helper/fixtureHelper');
const dateformat = require('dateformat');

test('should reject confirm request for missing shopping cart', async () => {
    return request(app)
        .put("/wertgarantie/components/confirmation/confirm")
        .send({signedShoppingCart: {}})
        .set('Accept', 'application/json')
        .expect(400)
});

describe('should handle shopping cart confirmation', function () {
    const agent = request.agent(app);
    const signedShoppingCart = testhelper.createSignedShoppingCart();

    it('confirm shopping cart', function (done) {
        agent.put('/wertgarantie/components/confirmation/confirm')
            .send({signedShoppingCart: signedShoppingCart})
            .set('Accept', 'application/json')
            .expect(200)
            .expect(function (res) {
                if (res.body.confirmed !== true) {
                    throw new Error("shopping cart not confirmed!")
                }
            }, done())
    });
});

describe('should handle shopping cart confirmation rejection', function () {
    const agent = request.agent(app);
    const clientId = uuid();
    const signedShoppingCart = testhelper.createSignedShoppingCart();

    it('confirm shopping cart', function (done) {
        agent.put('/wertgarantie/components/confirmation/confirm')
            .send({signedShoppingCart: signedShoppingCart})
            .set('Accept', 'application/json')
            .expect(200, done);
    });

    it('unconfirm shopping cart', function (done) {
        agent.delete('/wertgarantie/components/confirmation/confirm')
            .send({signedShoppingCart: signedShoppingCart})
            .set('Accept', 'application/json')
            .expect(200)
            .expect(function (res) {
                if (res.body.confirmed !== true) {
                    throw new Error("shopping cart not confirmed!")
                }
            }, done())
    });
});


test("should return valid confirmation data", async () => {

    const clientData = await testhelper.createDefaultClient();

    const deviceClass = uuid();
    const signedShoppingCart = testhelper.createSignedShoppingCart({
        clientId: clientData.publicClientIds[0],
        deviceClass: deviceClass,
        devicePrice: parseFloat(getProductOffersResponse.payload[0].price) * 100,
        shopProductId: getProductOffersResponse.payload[0].id
    });

    nock(process.env.HEIMDALL_URI)
        .get("/api/v1/auth/client/" + clientData.secrets[0])
        .reply(200, {
            payload: {
                access_token: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjVmMjk1NzQ2ZjE5Mzk3OTZmYmMzMjYxm..."
            }
        });

    nock(process.env.HEIMDALL_URI)
        .get(`/api/v1/product-offers?device_class=${deviceClass}&device_purchase_price=${signedShoppingCart.shoppingCart.products[0].devicePrice / 100}&device_purchase_date=${dateformat(new Date(), 'yyyy-mm-dd')}`)
        .reply(200, getProductOffersResponse);
    const response = await request.agent(app).put('/wertgarantie/components/confirmation')
        .send({signedShoppingCart: signedShoppingCart});
    expect(response.status).toBe(200);
    expect(response.body.signedShoppingCart).toEqual(signedShoppingCart);
    expect(response.body.shoppingCart).toEqual(undefined);
    expect(response.body.confirmed).toEqual(false);
    expect(response.body.products.length).toEqual(1);
});