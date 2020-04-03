const request = require('supertest');
const app = require('../../src/app');
const nockHelper = require('../helper/nockHelper');
const getProductOffersResponse = require('./heimdallResponses').getProductOffersResponse;
const testhelper = require('../helper/fixtureHelper');

test('should reject confirm request for missing shopping cart', async () => {
    const result = await request(app)
        .put("/wertgarantie/components/confirmation/confirm")
        .send({signedShoppingCart: {}})
        .set('Accept', 'application/json');

    expect(result.status).toBe(400);
});

test('should handle shopping cart confirmation', async function () {
    const agent = request.agent(app);
    const signedShoppingCart = testhelper.createSignedShoppingCart();

    const result = await agent.put('/wertgarantie/components/confirmation/legalAgeConfirmed')
        .send({signedShoppingCart: signedShoppingCart})
        .set('Accept', 'application/json');

    expect(result.status).toBe(200);
    expect(result.body.signedShoppingCart.shoppingCart.legalAgeConfirmed).toBe(true);
});

describe('should handle shopping cart confirmation rejection', function () {
    const agent = request.agent(app);
    const signedShoppingCart = testhelper.createSignedShoppingCart();

    it('confirm shopping cart', async function () {
        const result = await agent.put('/wertgarantie/components/confirmation/legalAgeConfirmed')
            .send({signedShoppingCart: signedShoppingCart})
            .set('Accept', 'application/json');
        expect(result.status).toBe(200);
    });

    it('unconfirm shopping cart', async function () {
        const result = await agent.delete('/wertgarantie/components/confirmation/legalAgeConfirmed')
            .send({signedShoppingCart: signedShoppingCart})
            .set('Accept', 'application/json');

        expect(result.status).toBe(200);
        expect(result.body.signedShoppingCart.shoppingCart.legalAgeConfirmed).toBe(false);
    });
});


test("should return valid confirmation data", async () => {

    const clientData = await testhelper.createDefaultClient();

    const signedShoppingCart = testhelper.createSignedShoppingCart({
        clientId: clientData.publicClientIds[0],
        devicePrice: parseFloat(getProductOffersResponse.payload[0].price) * 100
    });

    nockHelper.nockHeimdallLogin(clientData);
    nockHelper.getNockedHeimdallProductOffers(signedShoppingCart);

    const response = await request.agent(app).put('/wertgarantie/components/confirmation')
        .send({signedShoppingCart: signedShoppingCart});
    expect(response.status).toBe(200);
    expect(response.body.signedShoppingCart).toEqual(signedShoppingCart);
    expect(response.body.shoppingCart).toEqual(undefined);
    expect(response.body.legalAgeConfirmed).toEqual(false);
    expect(response.body.termsAndConditionsConfirmed).toEqual(false);
    expect(response.body.products.length).toEqual(1);
});