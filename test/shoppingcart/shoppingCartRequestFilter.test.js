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

test('should convert base64 encoded string to webshopData', async () => {
    const mockRequest = {
        body: {
            "webshopData": "eyJwdXJjaGFzZWRQcm9kdWN0cyI6W3sicHJpY2UiOjg2MDAwLCJtYW51ZmFjdHVyZXIiOiJYWFhQaG9uZXMgSW5jLiIsImRldmljZUNsYXNzIjoiU21hcnRwaG9uZSIsIm1vZGVsIjoiRmxhc2ggSGFuZHkgMzAwMCBQcm8iLCJkZXZpY2VPUyI6ImFuZHJvaWQifV0sImN1c3RvbWVyIjp7ImNvbXBhbnkiOiJJTk5PUSIsInNhbHV0YXRpb24iOiJIZXJyIiwiZmlyc3RuYW1lIjoiTWF4IiwibGFzdG5hbWUiOiJNdXN0ZXJtYW5uIiwic3RyZWV0IjoiVW50ZXIgZGVuIExpbmRlbiA5IiwiemlwIjoiNTIzNDUiLCJjaXR5IjoiS8O2bG4iLCJjb3VudHJ5IjoiRGV1dHNjaGxhbmQiLCJlbWFpbCI6Im1heC5tdXN0ZXJtYW5uMTIzNEB0ZXN0LmNvbSJ9LCJlbmNyeXB0ZWRTZXNzaW9uSWQiOiJlNjFiNGRiYTA3MWQ1MDM5ZjEwMGUxMzM4YTViODdmNjAzZDNmYzlhMTc5NjczYzA5YzJkOWEzZGVlNmQ5ZTkxIn0=",
            "signedShoppingCart": {
                "shoppingCart": {
                    "sessionId": "c6aec80a-a430-40bd-a988-f627b2f358d0",
                    "publicClientId": "public:5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
                    "orders": [{
                        "id": "80b284ec-30c9-4f18-9150-8f8ae91525a1",
                        "shopProduct": {
                            "price": 86000,
                            "deviceClass": "Smartphone",
                            "model": "Flash Handy 3000 Pro"
                        },
                        "wertgarantieProduct": {
                            "id": "d6ac561e-4d83-46a5-8857-f523ea569190",
                            "name": "Komplettschutz",
                            "paymentInterval": "monthly"
                        }
                    }],
                    "confirmations": {"termsAndConditionsConfirmed": true}
                }, "signature": "36a57e053f6a5c795b7a1778bba62782dc9990a252fd11a3ee76e0079cdce9b4"
            }
        }
    };

    const next = jest.fn();

    await requestFilter.filterAndValidateBase64EncodedWebshopData(mockRequest, {}, next);

    const expectedResult = {
        "purchasedProducts": [
            {
                "price": 86000,
                "manufacturer": "XXXPhones Inc.",
                "deviceClass": "Smartphone",
                "model": "Flash Handy 3000 Pro",
                "deviceOS": "android"
            }
        ],
        "customer": {
            "company": "INNOQ",
            "salutation": "Herr",
            "firstname": "Max",
            "lastname": "Mustermann",
            "street": "Unter den Linden 9",
            "zip": "52345",
            "city": "Köln",
            "country": "Deutschland",
            "email": "max.mustermann1234@test.com"
        },
        "encryptedSessionId": "e61b4dba071d5039f100e1338a5b87f603d3fc9a179673c09c2d9a3dee6d9e91"
    };
    expect(mockRequest.body.webshopData).toEqual(expectedResult);
});

test('should fail if checkout data is incomplete', async () => {
    const mockRequest = {
        body: {
            "webshopData": "eyJjb21wYW55IjoiSU5OT1EiLCJzYWx1dGF0aW9uIjoiSGVyciIsImZpcnN0bmFtZSI6Ik1heCIsImNvdW50cnkiOiJEZXV0c2NobGFuZCJ9",
            "signedShoppingCart": {
                "shoppingCart": {
                    "sessionId": "c6aec80a-a430-40bd-a988-f627b2f358d0",
                    "publicClientId": "public:5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
                    "orders": [{
                        "id": "80b284ec-30c9-4f18-9150-8f8ae91525a1",
                        "shopProduct": {
                            "price": 86000,
                            "deviceClass": "Smartphone",
                            "model": "Flash Handy 3000 Pro"
                        },
                        "wertgarantieProduct": {
                            "id": "d6ac561e-4d83-46a5-8857-f523ea569190",
                            "name": "Komplettschutz",
                            "paymentInterval": "monthly"
                        }
                    }],
                    "confirmations": {"termsAndConditionsConfirmed": true}
                }, "signature": "36a57e053f6a5c795b7a1778bba62782dc9990a252fd11a3ee76e0079cdce9b4"
            }
        }
    };

    const next = jest.fn();
    requestFilter.filterAndValidateBase64EncodedWebshopData(mockRequest, {}, next);
    expect(next.mock.calls[0][0].name).toEqual("ValidationError");
});
