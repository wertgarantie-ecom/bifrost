const checkoutRepository = require('../../src/shoppingcart/checkoutRepository');
const uuid = require('uuid');

describe("test persist and find by session in checkout repository", () => {
    const sessionId1 = uuid();
    const sessionId2 = uuid();
    const clientId = "public:" + uuid();
    const traceId = uuid();
    const purchasesSession1 = [purchaseWithId(uuid()), purchaseWithId(uuid())];
    const purchasesSession2 = [purchaseWithId(uuid()), purchaseWithId(uuid())];

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

    test('could find second checkout data', async () => {
        const result = await checkoutRepository.findBySessionId(sessionId2);
        const expectedResult = {
            clientId: clientId,
            sessionId: sessionId2,
            traceId: traceId,
            purchases: purchasesSession2
        };
        expect(result).toEqual(expectedResult);
    });

    test('should retrieve all persisted sessions', async () => {
        const result = await checkoutRepository.findAll(2);
        const expectedResult = [{
            clientId: clientId,
            sessionId: sessionId1,
            traceId: traceId,
            purchases: purchasesSession1
        }, {
            clientId: clientId,
            sessionId: sessionId1,
            traceId: traceId,
            purchases: purchasesSession2
        }];
        expect(result).toEqual(expectedResult);
    });

});

function purchaseWithId(id) {
    return {
        id: id,
        wertgarantieProductId: "10",
        wertgarantieProductName: "Basic",
        deviceClass: "0dc47b8a-f984-11e9-adcf-afabcc521093",
        devicePrice: 139999,
        success: true,
        message: "what a nice purchase",
        shopProduct: "iPhone X",
        contractNumber: "23479998",
        transactionNumber: "7524545",
        backend: "heimdall",
        backendResponseInfo: "a447s7s6666f"
    }
}
