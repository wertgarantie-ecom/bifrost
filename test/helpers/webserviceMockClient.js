const webservicesResponses = require('../../integration-test/backends/webservices/webservicesResponses');
const _ = require('lodash');
const uuid = require('uuid');

module.exports.createMockWebserviceClientWithPhoneConfig = (session = uuid()) => {
    return {
        getLegalDocuments: () => webservicesResponses.multipleLegalDocuments,
        getComparisonDocuments: () => webservicesResponses.multipleComparisonDocumentsResponse,
        login: () => session,
        getAgentData: () => {
            const agentData = _.cloneDeep(webservicesResponses.agentDataMultipleMultimediaProducts);
            agentData.RESULT.PRODUCT_LIST.PRODUCT.map(product => {
                if (!Array.isArray(product.PAYMENTINTERVALS.INTERVAL)) {
                    product.PAYMENTINTERVALS.INTERVAL = [product.PAYMENTINTERVALS.INTERVAL];
                }
            });
            return agentData;
        },
        getInsurancePremium: () => webservicesResponses.insurancePremiumResponse
    }
};

module.exports.createMockWebserviceClientWithBikeConfig = (session = uuid()) => {
    return {
        getLegalDocuments: () => webservicesResponses.multipleLegalDocuments,
        getComparisonDocuments: () => webservicesResponses.multipleComparisonDocumentsResponse,
        login: () => session,
        getAgentData: () => {
            const agentData = _.cloneDeep(webservicesResponses.agentDataMultipleBikeProducts);
            agentData.RESULT.PRODUCT_LIST.PRODUCT.map(product => {
                if (!Array.isArray(product.PAYMENTINTERVALS.INTERVAL)) {
                    product.PAYMENTINTERVALS.INTERVAL = [product.PAYMENTINTERVALS.INTERVAL];
                }
            });
            return agentData;
        },
        getInsurancePremium: () => webservicesResponses.insurancePremiumResponse
    }
};
