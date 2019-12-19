const axios = require('axios');
const heimdallUri = process.env.HEIMDALL_URI || "http://localhost:3001";

exports.getProductOffers = async function getProductOffers(clientId, deviceClass, devicePrice, date, client = axios) {
    const url = heimdallUri + "/api/v1/product-offers?device_class=" + deviceClass +
        "&device_purchase_price=" + devicePrice +
        "&device_purchase_date=" + date.toLocaleDateString();
    const options = {
        headers: {'Accept': 'application/json', "Authorization": "12345"}
    };
    const response = await client.get(url, options);
    const content = response.data;

    if (!content.payload) {
        const error = new Error("No products have been defined for provided device class: " + deviceClass);
        error.status = 400;
        throw error;
    }
    return content;
};

