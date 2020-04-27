const checkoutRepository = require('../../src/shoppingcart/CheckoutRepository');
const uuid = require('uuid');

describe("test persist and find by session in checkout repository", () => {
    const sessionId = uuid();
    const clientId = "public:" + uuid();
    const traceId = uuid();
    const purchase1Id = uuid();
    const purchase2Id = uuid();
    const purchases = [
        {
            id: purchase1Id,
            wertgarantieProductId: uuid(),
            wertgarantieProductName: "Basic",
            wertgarantieDeviceClass: "9025",
            success: true,
            message: "what a nice purchase",
            shopDeviceModel: "iPhone X",
            shopDeviceClass: "0dc47b8a-f984-11e9-adcf-afabcc521093",
            shopDevicePrice: 139999,
            contractNumber: 23479998,
            transactionNumber: "7524545",
            activationCode: "a447s7s6666f",
            backend: "heimdall"
        },
        {
            id: purchase2Id,
            wertgarantieProductId: "10",
            wertgarantieProductName: "Premium",
            wertgarantieDeviceClass: "9025",
            success: true,
            message: "it's awesome",
            shopDevicePrice: 139999,
            shopDeviceModel: "iPhone X",
            shopDeviceClass: "iPhone X",
            resultCode: "10",
            contractNumber: 23479999,
            transactionNumber: uuid(),
            activationCode: undefined,
            backend: "webservices"
        },
        {
            id: uuid(),
            wertgarantieProductId: "10",
            wertgarantieProductName: "Premium",
            wertgarantieDeviceClass: "9025",
            success: false,
            message: "failure",
            resultCode: "10",
            shopDevicePrice: 139999,
            shopDeviceModel: "iPhone X",
            shopDeviceClass: "iPhone X",
            backend: "webservices",
            activationCode: undefined,
            contractNumber: undefined,
            transactionNumber: undefined,
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
