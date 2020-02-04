const requestFilter = require('../../src/routes/shoppingCartRequestFilter');
const ClientError = require('../../src/errors/ClientError');

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
        }
    };

    const mockResponseHeaders = [];
    const mockResponse = {
        set: (name, value) => mockResponseHeaders.push(`${name}=${value}`),
    };
    await requestFilter.validateShoppingCart(mockRequest, mockResponse, next, {
        findBySessionId: () => true,
        verifyShoppingCart: () => true
    });

    expect(mockResponse.shoppingCart).toBe(undefined);
    expect(mockRequest.signedShoppingCart).toBe(undefined);
    expect(mockRequest.shoppingCart).toBe(undefined);
    expect(mockResponseHeaders).toContain('X-wertgarantie-shopping-cart-delete=true');
});

test('should throw ClientError on invalid signatures', async () => {
    expect.assertions(1);

    const mockRequest = {
        body: {
            signedShoppingCart: {
                signature: "invalid"
            }
        }
    };

    try {
        await requestFilter.validateShoppingCart(mockRequest, {}, next, {
            verifyShoppingCart: () => false
        });
    } catch (e) {
        expect(e.name).toBe('ClientError');
    }
});

test('should call next if no shopping cart is given', async () => {
    const mockRequest = {
        body: {}
    };
    const next = jest.fn();

    await requestFilter.validateShoppingCart(mockRequest, {}, next, {});

    expect(next.mock.calls.length).toBe(1)
});

