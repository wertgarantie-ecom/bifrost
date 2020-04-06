const webservicesClient = require('../../src/services/webservicesClient');
const nockHelper = require('../helper/nockHelper');
const responses = require('./webservicesResponses');

describe("webservices roundtrip", () => {
    const clientConfig = {
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

    const session = "DG21585917903JR99E8D45931QQ81J1TL3CX4Q49181L17Q921Z233GB6ER5XI";


    nockHelper.nockWebservicesLogin(session);
    nockHelper.nockGetAgentData();

    test("should execute proper login call", async () => {
        const retrievedSession = await webservicesClient.login(clientConfig);
        expect(retrievedSession).toEqual(session);
    });

    let productType;
    let applicationCode;
    test("should get agent data", async (done) => {
        nockHelper.nockGetAgentData();
        const agentData = await webservicesClient.getAgentData("DG21585917903JR99E8D45931QQ81J1TL3CX4Q49181L17Q921Z233GB6ER5XI");
        expect(agentData).toEqual(responses.agentData);
        productType = agentData.RESULT.PRODUCT_LIST.PRODUCT.PRODUCT_TYPE;
        productType = agentData.RESULT.PRODUCT_LIST.PRODUCT.APPLICATION_CODE
    });

    test

});

