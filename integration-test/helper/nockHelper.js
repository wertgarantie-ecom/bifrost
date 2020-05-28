const nock = require('nock');
const defaultProductOffersResponse = require('../backends/heimdall/heimdallResponses').getProductOffersResponse;
const dateformat = require('dateformat');
const agentDataMultipleProductsTestResponse = require('../backends/webservices/webservicesResponses').agentDataMultipleMultimediaProducts;
const advertisingTextResponse = require('../backends/webservices/webservicesResponses').advertisingText;
const insurancePremiumResponse = require('../backends/webservices/webservicesResponses').insurancePremiumResponse;
const comparisonDocumentsResponse = require('../backends/webservices/webservicesResponses').multipleComparisonDocumentsResponse;
const legalDocumentsResponse = require('../backends/webservices/webservicesResponses').multipleLegalDocuments;
const getNewContractNumber = require('../backends/webservices/webservicesResponses').getNewContractNumber;
const successfulInsuranceProposal = require('../backends/webservices/webservicesResponses').successfulInsuranceProposal;
const _ = require('lodash');


exports.nockHeimdallLogin = function nockHeimdallLogin(clientData) {
    nock(process.env.HEIMDALL_URI)
        .get("/api/v1/auth/client/" + clientData.backends.heimdall.clientId)
        .reply(200, {
            payload: {
                access_token: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjVmMjk1NzQ2ZjE5Mzk3OTZmYmMzMjYxm..."
            }
        });
};

exports.getNockedHeimdallProductOffers = function getNockedHeimdallProductOffers(signedShoppingCart, clientConfig, response = defaultProductOffersResponse, responseStatus = 200) {
    const heimdallDeviceClass = _.find(clientConfig.backends.heimdall.deviceClassMappings, mapping => mapping.shopDeviceClass === signedShoppingCart.shoppingCart.orders[0].shopProduct.deviceClass).heimdallDeviceClass;
    nock(process.env.HEIMDALL_URI)
        .get(`/api/v1/product-offers?device_class=${heimdallDeviceClass}&device_purchase_price=${signedShoppingCart.shoppingCart.orders[0].shopProduct.price / 100}&device_purchase_date=${dateformat(new Date(), 'yyyy-mm-dd')}`)
        .reply(responseStatus, response);
};

exports.nockHeimdallCheckoutShoppingCart = function nockHeimdallCheckoutShoppingCart(wertgarantieProductId, response) {
    nock(process.env.HEIMDALL_URI)
        .post("/api/v1/products/" + wertgarantieProductId + "/checkout")
        .reply(200, response);
};

exports.nockWebservicesLogin = function nockWebservicesLogin(session) {
    nock(process.env.WEBSERVICES_URI)
        .post("/login.pl")
        .reply(200, {
            "STATUS": "OK: Login",
            "SESSION": session,
            "STATUSCODE": "0"
        });
};

exports.nockGetAgentData = function nockGetAgentData() {
    nock(process.env.WEBSERVICES_URI)
        .post("/callservice.pl")
        .reply(200, agentDataMultipleProductsTestResponse);
};

exports.nockGetAdvertisingTexts = function nockGetAdvertisingTexts() {
    nock(process.env.WEBSERVICES_URI)
        .post("/callservice.pl")
        .reply(200, advertisingTextResponse);
};

exports.nockGetInsurancePremium = function nockGetInsurancePremium() {
    nock(process.env.WEBSERVICES_URI)
        .post("/callservice.pl")
        .reply(200, insurancePremiumResponse);
};

exports.nockGetComparisonDocuments = function nockGetComparisonDocuments() {
    nock(process.env.WEBSERVICES_URI)
        .post("/callservice.pl")
        .reply(200, comparisonDocumentsResponse);
};

exports.nockGetLegalDocuments = function nockGetLegalDocuments() {
    nock(process.env.WEBSERVICES_URI)
        .post("/callservice.pl")
        .reply(200, legalDocumentsResponse);
};

exports.nockGetNewContractNumber = function nockGetNewContractNumber(contractNumber) {
    nock(process.env.WEBSERVICES_URI)
        .post("/callservice.pl", /form-data; name="FUNCTION"[^]*GET_NEW_CONTRACTNUMBER/m)
        .reply(200, getNewContractNumber(contractNumber))
};

exports.nockSubmitInsuranceProposal = function nockSubmitInsuranceProposal() {
    nock(process.env.WEBSERVICES_URI)
        .post("/callservice.pl", /form-data; name="FUNCTION"[^]*SET_XML_INTERFACE/m)
        .reply(200, successfulInsuranceProposal)
}
