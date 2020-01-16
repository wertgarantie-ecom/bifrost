const checkoutRepository = require('../../src/repositories/CheckoutRepository');
const uuid = require('uuid');

describe("test persist and find by session in checkout repository", () => {
    const sessionId = uuid();
    const clientId = uuid();
    const traceId = uuid();
    const purchase1Id = uuid();
    const purchase2Id = uuid();
    const purchases = [
        {
            id: purchase1Id,
            wertgarantieProductId: 10,
            deviceClass: "0dc47b8a-f984-11e9-adcf-afabcc521093",
            devicePrice: 139999,
            success: true,
            message: "what a nice purchase",
            shopProduct: "iPhone X",
            contractNumber: 23479998,
            transactionNumber: 7524545,
            activationCode: "a447s7s6666f"
        },
        {
            id: purchase2Id,
            wertgarantieProductId: 10,
            deviceClass: "0dc47b8a-f984-11e9-adcf-afabcc521093",
            devicePrice: 139999,
            success: true,
            message: "it's awesome",
            shopProduct: "iPhone X",
            contractNumber: 23479999,
            transactionNumber: 7524546,
            activationCode: "a447s7s6666g"
        }
    ];

    test('Repository should persist and retrieve checkout data ', async (done) => {
        const checkoutData = {
            sessionId: sessionId,
            clientId: clientId,
            traceId: traceId,
            purchases: purchases
        };
        await checkoutRepository.persist(checkoutData);
        done()
    });
    test('Repository should successfully retrieve data from DB', async (done) => {
        const result = await checkoutRepository.findBySessionId(sessionId);
        const expectedResult = {
            clientId: clientId,
            sessionId: sessionId,
            traceId: traceId,
            purchases: purchases
        };
        expect(result).toEqual(expectedResult);
        done();
    })
});
