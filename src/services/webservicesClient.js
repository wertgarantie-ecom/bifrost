const _httpClient = require('axios');
const FormData = require('form-data');

exports.login = async function login(clientData, httpClient = _httpClient) {
    const formData = new FormData();
    formData.append('FUNCTION', 'LOGIN');
    formData.append('USER', clientData.webservices.username);
    formData.append('PASSWORD', clientData.webservices.password);
    formData.append('COMPANY', 'WG');
    formData.append('API', 'JSON');
    const formHeaders = formData.getHeaders();
    const contentLength = formData.getLengthSync();
    const request = {
        method: 'post',
        url: process.env.WEBSERVICES_LOGIN_URI,
        data: formData,
        headers: {
            "Content-Length": contentLength,
            ...formHeaders
        }
    };
    const response = await sendWebservicesRequest(request, httpClient, "0");
    return response.SESSION;
};

async function sendWebservicesRequest(request, httpClient, expectedStatusCode) {
    let response;
    try {
        response = await httpClient(request);
        if (response.data.STATUSCODE === expectedStatusCode) {
            return response.data;
        }
    } catch (e) {
        if (e.response) {
            throw new WebserviceError(`Webservices could not process the following request: ${JSON.stringify(request)}, responded with: ${JSON.stringify(e.response.data)}`);
        } else {
            throw new WebserviceError(`Could not connect to Webservices: ${JSON.stringify(request)}`);
        }
    }
    throw new WebserviceError(`Webservices did not answer with status code ${expectedStatusCode} for request: ${JSON.stringify(request)}. Webservices responded with: ${JSON.stringify(response.data, null, 2)}`);
}

class WebserviceError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}