const checkoutRepository = require('../../src/shoppingcart/checkoutRepository');
const fixtureHelper = require('../helper/fixtureHelper');
const uuid = require('uuid');

describe("test persist and find by session in checkout repository", () => {
    const sessionId1 = uuid();
    const sessionId2 = uuid();
    const clientId = "public:" + uuid();
    const traceId = uuid();
    const purchasesSession1 = [fixtureHelper.getValidPurchase(), fixtureHelper.getValidPurchase()];
    const purchasesSession2 = [fixtureHelper.getValidPurchase(), fixtureHelper.getValidPurchase()];

    test('Repository should persist checkout data', async () => {
        const checkoutData = {
            sessionId: sessionId1,
            clientId: clientId,
            traceId: traceId,
            purchases: purchasesSession1
        };
        await checkoutRepository.persist(checkoutData);
    });

    test('Repository should successfully retrieve data from DB by session id', async () => {
        const result = await checkoutRepository.findBySessionId(sessionId1);
        const expectedResult = {
            clientId: clientId,
            sessionId: sessionId1,
            traceId: traceId,
            purchases: purchasesSession1
        };
        expect(result).toEqual(expectedResult);
    });

    test('repository should persist second checkout data with different session id', async () => {
        const checkoutData = {
            sessionId: sessionId2,
            clientId: clientId,
            traceId: traceId,
            purchases: purchasesSession2
        };
        await checkoutRepository.persist(checkoutData);
    });


    test('should retrieve all persisted sessions', async () => {
        const result = await checkoutRepository.findAll(2);
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
        expect(result).toEqual(expectedResult);
    });
});

test('find by session id should return undefined in case of no checkout data avalable', async () => {
    const result = await checkoutRepository.findBySessionId(uuid());
    expect(result).toEqual(undefined);
})