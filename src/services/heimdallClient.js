const axios = require('axios');
const AxiosLogger = require('axios-logger');
const heimdallUri = process.env.HEIMDALL_URI || "http://localhost:3001";

const instance = axios.create();
instance.interceptors.request.use((request) => {
    return AxiosLogger.requestLogger(request, {
        dateFormat: 'HH:MM:ss',
        status: true,
        header: true,
    });
}, (error) => {
    return AxiosLogger.errorLogger(error);
});

instance.interceptors.response.use((response) => {
    return AxiosLogger.responseLogger(response, {
        dateFormat: 'HH:MM:ss',
        status: true,
        header: true,
    });
}, (error) => {
    return AxiosLogger.errorLogger(error);
});

async function getBearerToken(clientId, client) {
    const url = heimdallUri + "/api/v1/auth/client/" + clientId;
    const options = {
        headers: {'Accept': 'application/json'}
    };
    let responsePayload;
    try {
        const response = await client.get(url, options);
        responsePayload = response.data;
    } catch (e) {
        if (e.response) {
            throw new HeimdallClientError(`Could not retrieve bearer token from heimdall for client id: ${clientId}`);
        } else {
            throw new HeimdallConnectionError(`could not conntect to heimdall GET ${url} with options: ${JSON.stringify(options)}. Error message: ${e.message}`);
        }
    }
    if (!responsePayload.payload.access_Token) {
        const error = new Error(`Could not retrieve bearer token from heimdall for client id: ${clientId}`);
        error.status = 400;
        throw error;
    }
    return responsePayload.payload.access_Token;
}

exports.getProductOffers = async function getProductOffers(clientId, deviceClass, devicePrice, date = new Date(), client = axios) {
    const url = heimdallUri + "/api/v1/product-offers?device_class=" + deviceClass +
        "&device_purchase_price=" + devicePrice +
        "&device_purchase_date=" + date.toLocaleDateString();
    const secretClientId = clientId //mapping von public auf secret fehlt noch
    const bearerToken = await getBearerToken(secretClientId, client);
    const options = {
        headers: {'Accept': 'application/json', "Authorization": bearerToken}
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


exports.sendWertgarantieProductCheckout = async function sendWertgarantieProductCheckout(data, secretClientId, client = instance) {
    const heimdallCheckoutUrl = process.env.HEIMDALL_URI + "/api/v1/products/" + data.productId + "/checkout";
    const bearerToken = await getBearerToken(secretClientId, client);
    return await client({
        method: 'post',
        url: heimdallCheckoutUrl,
        data: data,
        withCredentials: true,
        headers: {
            "Authorization": "12345",
            "Content-Type": bearerToken
        }
    });
}


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
