const webservicesClient = require('../../src/services/webservicesClient');

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

test("should retrieve agent data", async () => {
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
            data: agentDataResponse
        }
    });

    const requestParameters = {
        objectCode: 9025,
        purchasePrice: 1000,
        activePartnerNumber: client.activePartnerNumber,
        session: "DG21585900354UV7KZ5FX4MH7ST7K85DY42G8Z33OR4GP4EA9B57Q3583712XV4JA9DLI",
        date: "31.03.2020"
    }

    try {
        const agentData = await webservicesClient.getAgentData(requestParameters, mockHttpClient);
        expect(agentData).toEqual(agentDataResponse)
    } catch (error) {
        fail();
    }
});

const agentDataResponse = {
    "RESULT": {
        "PRODUCT_LIST": {
            "PRODUCT": {
                "RISKS": {
                    "RISK": {
                        "RISK_NAME": "Diebstahlschutz",
                        "RISK_TYPE": "DIEBSTAHLSCHUTZ"
                    }
                },
                "APPLICATION_CODE": "GU WG DE KS 0419",
                "SIGNATURES": "0",
                "PURCHASE_PRICE_LIMITATIONS": {
                    "MAX_PRICE": {
                        "OBJECT_DESCRIPTION": "Smartphone",
                        "AMOUNT": "1800",
                        "OBJECT_CODE": "9025"
                    }
                },
                "PRODUCT_TYPE": "KOMPLETTSCHUTZ_2019",
                "PRODUCT_NAME": "Komplettschutz 2019",
                "COLLECTIONTYPES": {
                    "Einzug": "true",
                    "Selbstzahler": "true"
                },
                "TERM": "langfristig",
                "MAX_DEVICES_EACH_CONTRACT": "3",
                "PAYMENTINTERVALS": {
                    "INTERVAL": [
                        {
                            "VALUE": "1",
                            "DESCRIPTION": "monatlich"
                        },
                        {
                            "VALUE": "3",
                            "DESCRIPTION": "vierteljährlich"
                        },
                        {
                            "VALUE": "6",
                            "DESCRIPTION": "halbjährlich"
                        },
                        {
                            "VALUE": "12",
                            "DESCRIPTION": "jährlich"
                        }
                    ]
                },
                "SIGANATURES": "0"
            }
        }
    },
    "LANGUAGE": "DE",
    "MAXAMOUNT": "1",
    "AMOUNT": "30",
    "STATUS": "OK",
    "REQUEST_ID": "98838940",
    "ORDERBY": "PRODUCT_NAME",
    "SORT": "ASC",
    "STATUSCODE": "0",
    "PAGE": "1"
};


exports.agentDataTestResponse = agentDataResponse;