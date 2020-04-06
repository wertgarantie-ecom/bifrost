const axios = require('axios');
const FormData = require('form-data');
const AxiosLogger = require('axios-logger');

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((request) => {
    return AxiosLogger.requestLogger(request, {
        dateFormat: 'HH:MM:ss',
        status: true,
        url: true,
        method: true,
        header: true,
        data: true
    });
}, (error) => {
    return AxiosLogger.errorLogger(error);
});

axiosInstance.interceptors.response.use((response) => {
    return AxiosLogger.responseLogger(response, {
        dateFormat: 'HH:MM:ss',
        status: true,
        url: true,
        method: true,
        header: true,
        data: true
    });
}, (error) => {
    return AxiosLogger.errorLogger(error);
});

exports.login = async function login(clientData, httpClient = axiosInstance) {
    const formData = new FormData();
    formData.append('FUNCTION', 'LOGIN');
    formData.append('USER', clientData.webservices.username);
    formData.append('PASSWORD', clientData.webservices.password);
    formData.append('COMPANY', 'WG');
    formData.append('API', 'JSON');

    const response = await sendWebservicesRequest(formData, process.env.WEBSERVICES_URI + '/login.pl', httpClient, "0");
    return response.SESSION;
};

exports.getAgentData = async function getAgentData(requestParameters, httpClient = axiosInstance) {
    const formData = new FormData();
    formData.append('FUNCTION', 'GET_AGENT_DATA');
    formData.append('SHAPING', 'AVAILABLE_PRODUCTS');
    formData.append('API', 'JSON');
    formData.append('SESSION', requestParameters.session);
    formData.append('EXTENDED_RESULT', "true");
    return await sendWebservicesRequest(formData, process.env.WEBSERVICES_URI + '/callservice.pl', httpClient, "0");
};

async function sendWebservicesRequest(formData, uri, httpClient, expectedStatusCode) {
    let response;
    const formHeaders = formData.getHeaders();
    const contentLength = formData.getLengthSync();
    const request = {
        method: 'post',
        url: uri,
        data: formData,
        headers: {
            "Content-Length": contentLength,
            ...formHeaders
        }
    };
    try {
        response = await httpClient(request);
        if (response.data.STATUSCODE === expectedStatusCode) {
            return response.data;
        }
    } catch (e) {
        if (e.response) {
            throw new WebserviceError(`Webservices could not process the following request: ${JSON.stringify(request)}, responded with: ${JSON.stringify(e.response.data)}`);
        } else {
            throw new WebserviceError(`Could not connect to Webservices: ${JSON.stringify(request)}, error: ${e}`);
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