const checkoutRepository = require('../../src/shoppingcart/checkoutRepository');
const fixtureHelper = require('../helper/fixtureHelper');
const uuid = require('uuid');
const request = require('supertest');
const app = require('../../src/app');

describe("should retrieve all checkouts via controller", () => {
    const sessionId1 = uuid();
    const sessionId2 = uuid();
    const clientId = "public:" + uuid();
    const traceId = uuid();
    const purchasesSession1 = [fixtureHelper.getValidPurchase(), fixtureHelper.getValidPurchase()];
    const purchasesSession2 = [fixtureHelper.getValidPurchase(), fixtureHelper.getValidPurchase()];

    test("should persist checkouts", async () => {
        const checkoutData1 = {
            sessionId: sessionId1,
            clientId: clientId,
            traceId: traceId,
            purchases: purchasesSession1
        };
        await checkoutRepository.persist(checkoutData1);

        const checkoutData2 = {
            sessionId: sessionId2,
            clientId: clientId,
            traceId: traceId,
            purchases: purchasesSession2
        };
        await checkoutRepository.persist(checkoutData2);
    });

    test("should retrieve all purchases", async () => {
       const result = await request(app).get("/wertgarantie/checkouts?limit=2")
           .set('Accept', 'application/json');
       const expectedResult = [
           {
               clientId: clientId,
               sessionId: sessionId2,
               traceId: traceId,
               purchases: purchasesSession2
           },
           {
               clientId: clientId,
               sessionId: sessionId1,
               traceId: traceId,
               purchases: purchasesSession1
           }
       ];
       expect(result.body).toEqual(expectedResult);
    });
});
