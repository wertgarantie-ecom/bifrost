const nock = require('nock');
const agentDataMultipleProductsTestResponse = require('../backends/webservices/webservicesResponses').agentDataMultipleMultimediaProducts;
const advertisingTextResponse = require('../backends/webservices/webservicesResponses').advertisingText;
const insurancePremiumResponse = require('../backends/webservices/webservicesResponses').insurancePremiumResponse;
const legalDocumentsResponse = require('../backends/webservices/webservicesResponses').multipleLegalDocuments;
const getNewContractNumber = require('../backends/webservices/webservicesResponses').getNewContractNumber;
const successfulInsuranceProposal = require('../backends/webservices/webservicesResponses').successfulInsuranceProposal;


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
