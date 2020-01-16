const axios = require('axios');
const heimdallUri = process.env.HEIMDALL_URI || "http://localhost:3001";

exports.getProductOffers = async function getProductOffers(clientId, deviceClass, devicePrice, date = new Date(), client = axios) {
    const url = heimdallUri + "/api/v1/product-offers?device_class=" + deviceClass +
        "&device_purchase_price=" + devicePrice +
        "&device_purchase_date=" + date.toLocaleDateString();
    const options = {
        headers: {'Accept': 'application/json', "Authorization": "12345"}
    };
    let responsePayload;
    try {
        const response = await client.get(url, options);
        responsePayload = response.data;
    } catch (e) {
        if (e.response) {
            throw new HeimdallClientError(`could not get product offers for provided arguments: deviceClass: ${deviceClass}, devicePrice: ${devicePrice}`);
        } else {
            throw new HeimdallConnectionError(`could not conntect to heimdall GET ${url} with options: ${JSON.stringify(options)}. Error message: ${e.message}`);
        }
    }

    if (!responsePayload) {
        const error = new Error("No products have been defined for provided device class: " + deviceClass);
        error.status = 400;
        throw error;
    }
    return responsePayload;
};


class HeimdallConnectionError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class HeimdallClientError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
