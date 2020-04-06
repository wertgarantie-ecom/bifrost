const webservicesClient = require('../../src/services/webservicesClient');
const responses = require('../../integration-test/services/webservicesResponses');

test("should login", async () => {
    const client = {
        "id": "8d0f763a-5e5a-41da-9fa8-8b2a8a11fde6",
        "name": "Handyflash DEV",
        "heimdallClientId": "test-handyflash-heimdall-clientId",
        "webservices": {
            "username": "test-handyflash-user",
            "password": "test-handyflash-password"
        },
        "activePartnerNumber": 33333,
        "secrets": [
            "secret:test-handyflash-secret"
        ],
        "publicClientIds": [
            "public:b9f303d0-74e1-11ea-b9e9-034d1bd36e8d"
        ]
    };

    const mockHttpClient = jest.fn(() => {
        return {
            data: {
                "STATUS": "OK: Login",
                "SESSION": "DG21585900354UV7KZ5FX4MH7ST7K85DY42G8Z33OR4GP4EA9B57Q3583712XV4JA9DLI",
                "STATUSCODE": "0"
            }
        }
    });

    const loginResult = await webservicesClient.login(client, mockHttpClient);
    expect(loginResult).toBe("DG21585900354UV7KZ5FX4MH7ST7K85DY42G8Z33OR4GP4EA9B57Q3583712XV4JA9DLI")
});

test("should catch error when login did not succeed", async () => {
    const client = {
        "id": "8d0f763a-5e5a-41da-9fa8-8b2a8a11fde6",
        "name": "Handyflash DEV",
        "heimdallClientId": "test-handyflash-heimdall-clientId",
        "webservices": {
            "username": "test-handyflash-user",
            "password": "test-handyflash-password"
        },
        "activePartnerNumber": 33333,
        "secrets": [
            "secret:test-handyflash-secret"
        ],
        "publicClientIds": [
            "public:b9f303d0-74e1-11ea-b9e9-034d1bd36e8d"
        ]
    };

    const mockHttpClient = jest.fn(() => {
        return {
            data: {
                "STATUS": "Error: Could not verify user | no binding. Code:49",
                "STATUSCODE": "21"
            }
        }
    });
    try {
        await webservicesClient.login(client, mockHttpClient);
        fail("should have thrown an error due to failed login");
    } catch (error) {
        expect(error.name).toEqual('WebserviceError');
    }
});

test("should retrieve agent data for multiple products", async () => {
    const mockHttpClient = jest.fn(() => {
        return {
            data: responses.agentDataMultipleProducts
        }
    });

    try {
        const retrivedData = await webservicesClient.getAgentData("session", mockHttpClient);
        expect(retrivedData.RESULT.PRODUCT_LIST.PRODUCT[1].APPLICATION_CODE).toEqual("GU WG DE KS 0419");
    } catch (error) {
        fail(error);
    }
});

test("should retrieve agent data for single product", async () => {
    const mockHttpClient = jest.fn(() => {
        return {
            data: responses.agentDataSingleProduct
        }
    });

    try {
        const retrivedData = await webservicesClient.getAgentData("session", mockHttpClient);
        expect(retrivedData.RESULT.PRODUCT_LIST.PRODUCT[0].APPLICATION_CODE).toEqual("GU WG DE KS 0419");
    } catch (error) {
        fail(error);
    }
});

test("should retrieve advertising texts for product", async () => {
    const mockHttpClient = jest.fn(() => {
        return {
            data: responses.advertisingText
        }
    });

    try {
        const agentData = await webservicesClient.getAdvertisingTexts("session", "applicationCode", "productType", mockHttpClient);
        expect(agentData).toEqual(responses.advertisingText)
    } catch (error) {
        fail();
    }
});

const advertisingTextResponse = {};


