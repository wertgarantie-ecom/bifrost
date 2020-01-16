const sessionIdValidator = require('../../src/routes/sessionIdValidator');


test("should remove cookies for successful insurance purchases", async () => {
    const mockRequest = {
        signedCookies: 
        {
            "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f": {
                "sessionId": "bb25bbf0-2bb8-4f15-aaf1-f73ade6fd862",
                "clientId": "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
                "products": [
                    {
                        "wertgarantieProductId": 10,
                        "deviceClass": "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                        "devicePrice": 139999,
                        "deviceCurrency": "EUR",
                        "shopProductName": "E-Mountainbike Premium 3000",
                        "orderId": "e0accedd-b087-46df-899e-91229eb43747"
                    }
                ],
                "confirmed": false
            }
        }
    }

    const mockRepository = {
        findBySessionId: jest.fn(() => true)
    }

    const mockResponse = {
        clearCookie: jest.fn(() => {
            
        })
    }
    await sessionIdValidator.validateSessionId(mockRequest, mockResponse, () => {}, mockRepository);
    expect(mockResponse.clearCookie).toBeCalled();
    expect(mockRequest.signedCookies).toEqual({});
});