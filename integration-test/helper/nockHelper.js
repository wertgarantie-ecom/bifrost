const nock = require('nock');
const defaultProductOffersResponse = require('../controllers/heimdallResponses').getProductOffersResponse;
const dateformat = require('dateformat');
const agentDataMultipleProductsTestResponse = require('../services/webservicesResponses').agentDataMultipleProducts;
const advertisingTextResponse = require('../services/webservicesResponses').advertisingText;
const insurancePremiumResponse = require('../services/webservicesResponses').insurancePremiumResponse;


exports.nockHeimdallLogin = function nockHeimdallLogin(clientData) {
    nock(process.env.HEIMDALL_URI)
        .get("/api/v1/auth/client/" + clientData.heimdallClientId)
        .reply(200, {
            payload: {
                access_token: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjVmMjk1NzQ2ZjE5Mzk3OTZmYmMzMjYxm..."
            }
        });
};

exports.getNockedHeimdallProductOffers = function getNockedHeimdallProductOffers(signedShoppingCart, response = defaultProductOffersResponse, responseStatus = 200) {
    nock(process.env.HEIMDALL_URI)
        .get(`/api/v1/product-offers?device_class=${signedShoppingCart.shoppingCart.products[0].deviceClass}&device_purchase_price=${signedShoppingCart.shoppingCart.products[0].devicePrice / 100}&device_purchase_date=${dateformat(new Date(), 'yyyy-mm-dd')}`)
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