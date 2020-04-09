const webservicesResponses = require('../../integration-test/services/webservicesResponses');
const webservicesService = require('../../src/services/webservicesService');
const fixtureHelper = require('../../integration-test/helper/fixtureHelper');
const _ = require('lodash');

const testClientConfig = fixtureHelper.createDefaultClientWithWebservicesConfiguration();

test('should return relevant documents only', async () => {
    const product = {
        APPLICATION_CODE: "GU WG DE KS 0419",
        PRODUCT_TYPE: "KOMPLETTSCHUTZ_2019"
    };
    const webservicesClient = {
        getLegalDocuments: () => webservicesResponses.multipleLegalDocuments
    };

    const legalDocuments = await webservicesService.getLegalDocuments("session", product, webservicesClient);
    expect(legalDocuments.length).toBe(1);
    const document = legalDocuments[0];
    expect(document.document_name).toEqual("RECHTSDOKUMENTE.PDF");
    expect(document.document_type).toEqual("RECHTSDOKUMENTE");
    expect(document.document_link).toEqual("/documents/GU WG DE KS 0419/RECHTSDOKUMENTE.PDF");
});

test('should return valid productOffers for clientConfig', async () => {
    const mockWebservicesClient = {
        getLegalDocuments: () => webservicesResponses.multipleLegalDocuments,
        login: () => 'DG21586374946XD38P9X37K64BD3NI1L78XD9GR93B33E3N34CO456R26KL2DE5',
        getAgentData: () => {
            const agentData = _.cloneDeep(webservicesResponses.agentDataMultipleProducts);
            agentData.RESULT.PRODUCT_LIST.PRODUCT.map(product => {
                if (!Array.isArray(product.PAYMENTINTERVALS.INTERVAL)) {
                    product.PAYMENTINTERVALS.INTERVAL = [product.PAYMENTINTERVALS.INTERVAL];
                }
            });
            return agentData;
        },
        getInsurancePremium: () => webservicesResponses.insurancePremiumResponse
    };

    const clientConfig = fixtureHelper.createDefaultClientWithWebservicesConfiguration();
    const productOffers = await webservicesService.assembleProductOffers(clientConfig, mockWebservicesClient);

    console.log(JSON.stringify(productOffers, null, 2));
});

test('should filter wertgarantie products for one relevant product', async () => {

    const testClientConfig = {
        relevantProductTypes: [
            {
                name: "KOMPLETTSCHUTZ_2019"
            }
        ],
    };

    const mockClient = {
        getAgentData: () => webservicesResponses.agentDataMultipleProducts
    };

    const relevantProducts = await webservicesService.selectRelevantWertgarantieProducts("session", testClientConfig, mockClient);

    expect(relevantProducts.length).toBe(1);
    expect(relevantProducts[0].PRODUCT_TYPE).toEqual(testClientConfig.relevantProductTypes[0].name)
});

test('should filter wertgarantie products for two relevant products', async () => {



    const mockClient = {
        getAgentData: () => webservicesResponses.agentDataMultipleProducts
    };

    const relevantProducts = await webservicesService.selectRelevantWertgarantieProducts("session", testClientConfig, mockClient);

    expect(relevantProducts.length).toBe(2);
    expect(relevantProducts[0].PRODUCT_TYPE).toEqual("GERAETESCHUTZ_KOMFORT_3_2015");
    expect(relevantProducts[1].PRODUCT_TYPE).toEqual("KOMPLETTSCHUTZ_2019");
});
