const requestFilter = require('../../src/shoppingcart/shoppingCartRequestFilter');

const next = () => undefined;

test("should remove shopping carts which were already purchased", async () => {
    const mockRequest = {
        body: {
            signedShoppingCart: {
                signature: "abc",
                shoppingCart:
                    {
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
        },
        get: () => 'bb25bbf0-2bb8-4f15-aaf1-f73ade6fd862'

    };

    const mockResponseHeaders = [];
    const mockResponse = {
        set: (name, value) => mockResponseHeaders.push(`${name}=${value}`),
    };

    await requestFilter.checkSessionIdCheckout(mockRequest, mockResponse, next, () => true);

    requestFilter.validateShoppingCart(mockRequest, mockResponse, next,
        () => true
    );

    expect(mockResponse.shoppingCart).toBe(undefined);
    expect(mockRequest.signedShoppingCart).toBe(undefined);
    expect(mockRequest.shoppingCart).toBe(undefined);
    expect(mockResponseHeaders).toContain('X-wertgarantie-shopping-cart-delete=true');
});

test('should throw ClientError on invalid signatures', async () => {
    const mockRequest = {
        body: {
            signedShoppingCart: {
                signature: "invalid"
            }
        }
    };

    var next = jest.fn();
    requestFilter.validateShoppingCart(mockRequest, {}, next, () => false);
    expect(next.mock.calls[0][0].name).toBe("ClientError")
});

test('should call next if no shopping cart is given', async () => {
    const mockRequest = {
        body: {}
    };
    const next = jest.fn();

    await requestFilter.validateShoppingCart(mockRequest, {}, next, {});

    expect(next.mock.calls.length).toBe(1)
});

test('should convert base64 encoded string to shopping cart', async () => {
    const mockRequest = {
        body: {
            signedShoppingCart: "eyJzaG9wcGluZ0NhcnQiOnsic2Vzc2lvbklkIjoiMjlkZmRhMDgtNTg3OS00YjMwLTk3OTctYTQ4OGFhMGNiMzk5IiwiY2xpZW50SWQiOiI1MjA5ZDZlYS0xYTZlLTExZWEtOWY4ZC03NzhmMGFkOTEzN2YiLCJwcm9kdWN0cyI6W3sid2VydGdhcmFudGllUHJvZHVjdElkIjoxMSwiZGV2aWNlQ2xhc3MiOiI2YmRkMmQ5My00NWQwLTQ5ZTEtOGEwYy05OGViODAzNDIyMjIiLCJkZXZpY2VQcmljZSI6MTM5OTk5LCJkZXZpY2VDdXJyZW5jeSI6IkVVUiIsInNob3BQcm9kdWN0TmFtZSI6IkUtTW91bnRhaW5iaWtlIFByZW1pdW0gMzAwMCIsIm9yZGVySWQiOiJhOWI3Yjc3NS1iZTNhLTQwZjgtYmUwNC0zNTY0NjRkNjhmYzcifV0sImNvbmZpcm1lZCI6dHJ1ZX0sInNpZ25hdHVyZSI6Ik45bjJWaGY4SzNQTm5FVkdJUVRYQ0tzTEFOUkxJb1o0RzFSNGpBbXNMSVE9In0="
        }
    };

    const next = jest.fn();

    await requestFilter.detectBase64EncodedRequestBody(mockRequest, {}, next);

    expect(mockRequest.body.signedShoppingCart).toEqual({
        "shoppingCart": {
            "sessionId": "29dfda08-5879-4b30-9797-a488aa0cb399",
            "clientId": "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
            "products": [
                {
                    "wertgarantieProductId": 11,
                    "deviceClass": "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                    "devicePrice": 139999,
                    "deviceCurrency": "EUR",
                    "shopProductName": "E-Mountainbike Premium 3000",
                    "orderId": "a9b7b775-be3a-40f8-be04-356464d68fc7"
                }
            ],
            "confirmed": true
        },
        "signature": "N9n2Vhf8K3PNnEVGIQTXCKsLANRLIoZ4G1R4jAmsLIQ="
    });
})