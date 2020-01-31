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

async function getBearerToken(client, hpptClient) {
    const heimdallAuthUrl = heimdallUri + "/api/v1/auth/client/" + client.secrets[0];
    const request = {
        method: 'get',
        url: heimdallAuthUrl,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    };
    const response = await sendHeimdallRequest(request, hpptClient)
    return response.payload.access_token;
}

exports.getProductOffers = async function getProductOffers(client, deviceClass, devicePrice, date = new Date(), httpClient = axios) {
    const heimdallProductOffersUrl = heimdallUri + "/api/v1/product-offers?device_class=" + deviceClass +
        "&device_purchase_price=" + devicePrice +
        "&device_purchase_date=" + date.toLocaleDateString();
    const bearerToken = await getBearerToken(client, httpClient);
    const request = {
        method: 'get',
        url: heimdallProductOffersUrl,
        withCredentials: true,
        headers: {
            "Authorization": bearerToken,
            "Content-Type": "application/json"
        }
    };
    return sendHeimdallRequest(request, httpClient);
};

exports.sendWertgarantieProductCheckout = async function sendWertgarantieProductCheckout(data, client, httpClient = instance) {
    const heimdallCheckoutUrl = process.env.HEIMDALL_URI + "/api/v1/products/" + data.productId + "/checkout";
    const bearerToken = await getBearerToken(client, httpClient);
    const request = {
        method: 'post',
        url: heimdallCheckoutUrl,
        data: data,
        withCredentials: true,
        headers: {
            "Authorization": bearerToken,
            "Content-Type": "application/json"
        }
    };
    return sendHeimdallRequest(request, httpClient)
};

async function sendHeimdallRequest(request, client) {
    let responsePayload;
    try {
        const response = await client(request);
        responsePayload = response.data;
    } catch (e) {
        if (e.response) {
            throw new HeimdallClientError(`Heimdall could not process the following request: ${JSON.stringify(request)}. Heimdall responded with: ${JSON.stringify(e.response.data)}`);
        } else {
            throw new HeimdallConnectionError(`could not connect to heimdall: ${JSON.stringify(request)}`);
        }
    }

    if (!responsePayload) {
        const error = new Error("Unexpected empty response from Heimdall.");
        error.status = 400;
        throw error;
    }
    return responsePayload;
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
