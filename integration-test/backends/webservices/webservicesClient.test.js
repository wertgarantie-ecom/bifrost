const webservicesClient = require('../../../src/backends/webservices/webservicesClient');
const nockHelper = require('../../helper/nockHelper');
const responses = require('./webservicesResponses');
const _ = require('lodash');

describe("webservices roundtrip", () => {
    const clientConfig = {
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

    const session = "DG21585917903JR99E8D45931QQ81J1TL3CX4Q49181L17Q921Z233GB6ER5XI";


    nockHelper.nockWebservicesLogin(session);

    test("should execute proper login call", async () => {
        const retrievedSession = await webservicesClient.login(clientConfig.backends.webservices);
        expect(retrievedSession).toEqual(session);
    });

    let productType;
    let applicationCode;

    test("should get agent data", async () => {
        nockHelper.nockGetAgentData();
        const agentData = await webservicesClient.getAgentData(session, clientConfig);
        const expectedResult = _.cloneDeep(agentData);
        expectedResult.RESULT.PRODUCT_LIST.PRODUCT.map(product => {
            if (!Array.isArray(product.PAYMENTINTERVALS.INTERVAL)) {
                product.PAYMENTINTERVALS.INTERVAL = [product.PAYMENTINTERVALS.INTERVAL];
            }
        });
        expect(agentData).toEqual(expectedResult);
        productType = agentData.RESULT.PRODUCT_LIST.PRODUCT[1].PRODUCT_TYPE;
        applicationCode = agentData.RESULT.PRODUCT_LIST.PRODUCT[1].APPLICATION_CODE;
    });

    test("should get advertising texts", async () => {
        nockHelper.nockGetAdvertisingTexts();
        const advertisingTexts = await webservicesClient.getAdvertisingTexts(session, applicationCode, productType);
        expect(advertisingTexts.RESULT.ADVERTISING_TEXTS.ADVERTTISING_TEXT).toEqual(responses.advertisingText.RESULT.ADVERTISING_TEXTS.ADVERTTISING_TEXT);
    });

    test("should get insurance premium for product", async () => {
        const objectCode = 9025;
        const objectPrice = 699;
        const riskTypes = ["KOMPLETTSCHUTZ", "DIEBSTAHLSCHUTZ"];
        nockHelper.nockGetInsurancePremium();
        const insurancePremium = await webservicesClient.getInsurancePremium(session, applicationCode, productType, 1, objectCode, objectPrice, riskTypes);
        expect(insurancePremium).toEqual(responses.insurancePremiumResponse);
    });

    test("should retrieve LEGAL_DOCUMENTS", async () => {
        nockHelper.nockGetLegalDocuments();
        const legalDocuments = await webservicesClient.getLegalDocuments(session, applicationCode, productType);
        expect(legalDocuments).toEqual(responses.multipleLegalDocuments);
    })
});

