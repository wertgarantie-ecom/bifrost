const nock = require('nock');
const defaultProductOffersResponse = require('../controllers/heimdallResponses').getProductOffersResponse;
const dateformat = require('dateformat');


exports.nockLogin = function nockLogin(clientData) {
    nock(process.env.HEIMDALL_URI)
        .get("/api/v1/auth/client/" + clientData.heimdallClientId)
        .reply(200, {
            payload: {
                access_token: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjVmMjk1NzQ2ZjE5Mzk3OTZmYmMzMjYxm..."
            }
        });
};

exports.getNockedProductOffers = function getNockedProductOffers(signedShoppingCart, response = defaultProductOffersResponse, responseStatus = 200) {
    nock(process.env.HEIMDALL_URI)
        .get(`/api/v1/product-offers?device_class=${signedShoppingCart.shoppingCart.products[0].deviceClass}&device_purchase_price=${signedShoppingCart.shoppingCart.products[0].devicePrice / 100}&device_purchase_date=${dateformat(new Date(), 'yyyy-mm-dd')}`)
        .reply(responseStatus, response);
};

exports.nockCheckoutShoppingCart = function nockCheckoutShoppingCart(wertgarantieProductId, response) {
    nock(process.env.HEIMDALL_URI)
        .post("/api/v1/products/" + wertgarantieProductId + "/checkout")
        .reply(200, response);
};