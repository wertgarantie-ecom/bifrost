const webservicesClient = require('../../../src/backends/webservices/webservicesClient');
const responses = require('../../../integration-test/backends/webservices/webservicesResponses');
const dateformat = require('dateformat');
const _ = require('lodash');

test("should login", async () => {
    const client = {
        "id": "8d0f763a-5e5a-41da-9fa8-8b2a8a11fde6",
        "name": "Handyflash DEV",
        "backends": {
            "webservices": {
                "username": "test-handyflash-user",
                "password": "test-handyflash-password"
            }
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

    const loginResult = await webservicesClient.login(client.backends.webservices, mockHttpClient);
    expect(loginResult).toBe("DG21585900354UV7KZ5FX4MH7ST7K85DY42G8Z33OR4GP4EA9B57Q3583712XV4JA9DLI")
});

test("should catch error when login did not succeed", async () => {
    const client = {
        "id": "8d0f763a-5e5a-41da-9fa8-8b2a8a11fde6",
        "name": "Handyflash DEV",
        "backends": {
            "webservices": {
                "username": "test-handyflash-user",
                "password": "test-handyflash-password"
            },
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
        await webservicesClient.login(client.backends.webservices, mockHttpClient);
        fail("should have thrown an error due to failed login");
    } catch (error) {
        expect(error.name).toEqual('WebserviceError');
    }
});

test("should retrieve agent data for multiple products", async () => {
    const mockHttpClient = jest.fn(() => {
        return {
            data: responses.agentDataMultipleMultimediaProducts
        }
    });

    try {
        const retrivedData = await webservicesClient.getAgentData("session", {
            backends: {
                webservices: {
                    username: 123456
                }
            }
        }, mockHttpClient);
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
        const retrivedData = await webservicesClient.getAgentData("session", {
            backends: {
                webservices: {
                    username: 123456
                }
            }
        }, mockHttpClient);
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


test("should retrieve insurance premium for product", async () => {
    const mockHttpClient = jest.fn(() => {
        return {
            data: responses.insurancePremiumResponse
        }
    });

    try {
        const agentData = await webservicesClient.getInsurancePremium("session", "GU WG DE KS 0419", "KOMPLETTSCHUTZ_2019", 1, 9025, 699, ["KOMPLETTSCHUTZ", "DIEBSTAHLSCHUTZ"], 'DE', undefined, mockHttpClient);
        expect(agentData).toEqual(responses.insurancePremiumResponse);
    } catch (error) {
        fail(error);
    }
});

test("should assemble valid XML for insurance premium call", () => {
    const date = new Date();
    const dateFormatted = dateformat(date, 'dd.mm.yyyy');
    const year = date.getFullYear();
    const applicationCode = "GU WG DE KS 0419";
    const productType = "KOMPLETTSCHUTZ_2019";
    const paymentInterval = 1;
    const objectCode = 9025;
    const objectPrice = 69934;
    const riskTypes = ["KOMPLETTSCHUTZ", "DIEBSTAHLSCHUTZ"];
    const countryCode = 'DE';

    const xmlData = webservicesClient.assembleInsurancePremiumXmlData(applicationCode, countryCode, productType, paymentInterval, objectCode, objectPrice, riskTypes);
    expect(xmlData).toEqual(`<?xml version="1.0"?><PARAMETERS><APPLICATION_CODE>GU WG DE KS 0419</APPLICATION_CODE><TAX_COUNTRY_CODE>DE</TAX_COUNTRY_CODE><PRODUCTTYPE>KOMPLETTSCHUTZ_2019</PRODUCTTYPE><DATE>${dateFormatted}</DATE><APPLICATION_DATE>${dateFormatted}</APPLICATION_DATE><PAYMENT_INTERVAL>1</PAYMENT_INTERVAL><DEVICES><DEVICE><OBJECT_CODE>9025</OBJECT_CODE><OBJECT_PRICE>699,34</OBJECT_PRICE><PURCHASE_DATE>${dateFormatted}</PURCHASE_DATE><MANUFACTURER_YEAR>${year}</MANUFACTURER_YEAR><RISKS><RISK><RISIKOTYP>KOMPLETTSCHUTZ</RISIKOTYP></RISK><RISK><RISIKOTYP>DIEBSTAHLSCHUTZ</RISIKOTYP></RISK></RISKS></DEVICE></DEVICES></PARAMETERS>`);
});

test("should retrieve single LEGAL_DOCUMENT", async () => {
    const mockHttpClient = jest.fn(() => {
        return {
            data: responses.multipleLegalDocuments
        }
    });
    try {
        const legalDocuments = await webservicesClient.getLegalDocuments("session", "GU WG DE KS 0419", "KOMPLETTSCHUTZ_2019", mockHttpClient);
        expect(legalDocuments).toEqual(responses.multipleLegalDocuments);
    } catch (error) {
        fail(error);
    }
});

test('should retrieve new contract number', async () => {
    const mockHttpClient = jest.fn(() => {
        return {
            data: responses.newContractNumber
        }
    });
    try {
        const newContractNumber = await webservicesClient.getNewContractNumber("session", mockHttpClient);
        expect(newContractNumber).toBe("12345678");
    } catch (error) {
        fail(error);
    }
})