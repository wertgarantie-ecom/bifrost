const axios = require('axios');
const FormData = require('form-data');
const dateformat = require('dateformat');
const {create} = require('xmlbuilder2');
const AxiosLogger = require('axios-logger');

const axiosWithCompleteLogging = axios.create();
axiosWithCompleteLogging.interceptors.request.use((request) => {
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

axiosWithCompleteLogging.interceptors.response.use((response) => {
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
const axiosWithSimpleLogging = axios.create();
axiosWithSimpleLogging.interceptors.request.use((request) => {
    return AxiosLogger.requestLogger(request, {
        dateFormat: 'HH:MM:ss',
        status: true,
        url: true,
        method: true,
        header: true,
        data: false
    });
}, (error) => {
    return AxiosLogger.errorLogger(error);
});

axiosWithSimpleLogging.interceptors.response.use((response) => {
    return AxiosLogger.responseLogger(response, {
        dateFormat: 'HH:MM:ss',
        status: true,
        url: true,
        method: true,
        header: true,
        data: false
    });
}, (error) => {
    return AxiosLogger.errorLogger(error);
});

exports.login = async function login(webservicesClientConfig, httpClient = axiosWithCompleteLogging) {
    const formDataMap = new Map();
    formDataMap.set("FUNCTION", "LOGIN");
    formDataMap.set("USER", webservicesClientConfig.username);
    formDataMap.set("PASSWORD", webservicesClientConfig.password);
    formDataMap.set("COMPANY", "WG");
    formDataMap.set("API", "JSON");

    const response = await sendWebservicesRequest(formDataMap, process.env.WEBSERVICES_URI + '/login.pl', httpClient, "0");
    return response.SESSION;
};

exports.getAgentData = async function getAgentData(session, clientConfig, httpClient = axiosWithCompleteLogging) {
    const formDataMap = new Map();
    formDataMap.set('FUNCTION', 'GET_AGENT_DATA');
    formDataMap.set('SHAPING', 'AVAILABLE_PRODUCTS');
    formDataMap.set('API', 'JSON');
    formDataMap.set('SESSION', session);
    formDataMap.set('EXTENDED_RESULT', "true");
    formDataMap.set('AGENT_NR', clientConfig.activePartnerNumber);
    const result = await sendWebservicesRequest(formDataMap, process.env.WEBSERVICES_URI + '/callservice.pl', httpClient, "0");
    if (!Array.isArray(result.RESULT.PRODUCT_LIST.PRODUCT)) {
        result.RESULT.PRODUCT_LIST.PRODUCT = [result.RESULT.PRODUCT_LIST.PRODUCT];
    }
    result.RESULT.PRODUCT_LIST.PRODUCT.map(product => {
        if (!Array.isArray(product.PAYMENTINTERVALS.INTERVAL)) {
            product.PAYMENTINTERVALS.INTERVAL = [product.PAYMENTINTERVALS.INTERVAL];
        }
    });
    result.RESULT.PRODUCT_LIST.PRODUCT.map(product => {
        if (!Array.isArray(product.PURCHASE_PRICE_LIMITATIONS.MAX_PRICE)) {
            product.PURCHASE_PRICE_LIMITATIONS.MAX_PRICE = [product.PURCHASE_PRICE_LIMITATIONS.MAX_PRICE];
        }
    });
    return result;
};

exports.getAdvertisingTexts = async function getAdvertisingTexts(session, applicationCode, productType, httpClient = axiosWithCompleteLogging) {
    if (!(session && applicationCode && productType)) {
        throw new Error(`request data not provided. Session: ${session}, applicationCode: ${applicationCode}, productType: ${productType}`);
    }
    const formDataMap = new Map();
    formDataMap.set('FUNCTION', 'GET_PRODUCT_DATA');
    formDataMap.set('SHAPING', 'ADVERTISING_TEXT');
    formDataMap.set('API', 'JSON');
    formDataMap.set('SESSION', session);
    formDataMap.set('APPLICATION_CODE', applicationCode);
    formDataMap.set('PRODUCT_TYPE', productType);
    return await sendWebservicesRequest(formDataMap, process.env.WEBSERVICES_URI + '/callservice.pl', httpClient, "0");
};

exports.assembleInsurancePremiumXmlData = function assembleInsurancePremiumXmlData(applicationCode, countryCode, productType, paymentInterval, objectCode, objectPrice, riskTypes) {
    const date = new Date();
    const dateFormatted = dateformat(date, 'dd.mm.yyyy');
    const manufacturerYear = date.getFullYear();
    const objectPriceMajorUnits = (objectPrice / 100) + "";
    const objectPriceFormatted = objectPriceMajorUnits.replace(".", ",");
    const parametersJson = {
        "PARAMETERS": {
            "APPLICATION_CODE": applicationCode,
            "TAX_COUNTRY_CODE": countryCode,
            "PRODUCTTYPE": productType,
            "DATE": dateFormatted,
            "APPLICATION_DATE": dateFormatted,
            "PAYMENT_INTERVAL": paymentInterval
        }
    };
    parametersJson.PARAMETERS.DEVICES = [
        {
            "DEVICE": {
                "OBJECT_CODE": objectCode,
                "OBJECT_PRICE": objectPriceFormatted,
                "PURCHASE_DATE": dateFormatted,
                "MANUFACTURER_YEAR": manufacturerYear,
                "RISKS":
                    {
                        "RISK": riskTypes.map((risk) => {
                            return {
                                "RISIKOTYP": risk
                            }
                        }),
                    }
            }
        }
    ];
    return create(parametersJson).end();
};

exports.getInsurancePremium = async function getInsurancePremium(session, applicationCode, productType, paymentInterval, objectCode, objectPrice, riskTypes, countryCode = 'DE', httpClient = axiosWithCompleteLogging) {
    if (!(session && productType && applicationCode && objectCode && objectPrice && (riskTypes && riskTypes.length > 0))) {
        throw new Error(`request data not provided. Session: ${session}, productType: ${productType}, paymentInterval: ${paymentInterval}, applicationCode: ${applicationCode}, objectCode: ${objectCode}, objectPrice: ${objectPrice}, riskTypes: ${riskTypes}`);
    }
    const xmlData = this.assembleInsurancePremiumXmlData(applicationCode, countryCode, productType, paymentInterval, objectCode, objectPrice, riskTypes);
    const formDataMap = new Map();
    formDataMap.set('FUNCTION', 'GET_PRODUCT_DATA');
    formDataMap.set('SHAPING', 'INSURANCE_PREMIUM');
    formDataMap.set('API', 'JSON');
    formDataMap.set('SESSION', session);
    formDataMap.set('DATA', xmlData);
    return await sendWebservicesRequest(formDataMap, process.env.WEBSERVICES_URI + '/callservice.pl', httpClient, "0");
};

exports.getComparisonDocuments = async function getComparisonDocuments(session, applicationCode, productType, httpClient = axiosWithSimpleLogging) {
    if (!(session && productType && applicationCode)) {
        throw new Error(`request data not provided. Session: ${session}, productType: ${productType}, applicationCode: ${applicationCode}`);
    }
    const formDataMap = new Map();
    formDataMap.set('FUNCTION', 'GET_PRODUCT_DATA');
    formDataMap.set('SHAPING', 'COMPARISON_DOCUMENTS');
    formDataMap.set('API', 'JSON');
    formDataMap.set('SESSION', session);
    formDataMap.set('APPLICATION_CODE', applicationCode);
    formDataMap.set('PRODUCT_TYPE', productType);
    const result = await sendWebservicesRequest(formDataMap, process.env.WEBSERVICES_URI + '/callservice.pl', httpClient, "0");
    if (!Array.isArray(result.RESULT.DOCUMENTS.DOCUMENT)) {
        result.RESULT.DOCUMENTS.DOCUMENT = [result.RESULT.DOCUMENTS.DOCUMENT];
    }
    return result;
};

exports.getLegalDocuments = async function getLegalDocuments(session, applicationCode, productType, httpClient = axiosWithSimpleLogging) {
    if (!(session && productType && applicationCode)) {
        throw new Error(`request data not provided. Session: ${session}, productType: ${productType}, applicationCode: ${applicationCode}`);
    }
    const formDataMap = new Map();
    formDataMap.set('FUNCTION', 'GET_PRODUCT_DATA');
    formDataMap.set('SHAPING', 'LEGAL_DOCUMENTS');
    formDataMap.set('API', 'JSON');
    formDataMap.set('SESSION', session);
    formDataMap.set('APPLICATION_CODE', applicationCode);
    formDataMap.set('PRODUCT_TYPE', productType);
    formDataMap.set('DOCUMENT_TYPE', 'EINZELN');
    const result = await sendWebservicesRequest(formDataMap, process.env.WEBSERVICES_URI + '/callservice.pl', httpClient, "0");
    if (!Array.isArray(result.RESULT.DOCUMENT)) {
        result.RESULT.DOCUMENT = [result.RESULT.DOCUMENT];
    }
    return result;
};

exports.getNewContractNumber = async function getNewContractNumber(session, httpClient = axiosWithCompleteLogging) {
    if (!session) {
        throw new Error(`request data not provided. Session: ${session}`);
    }
    const formDataMap = new Map();
    formDataMap.set('FUNCTION', 'GET_NEW_CONTRACTNUMBER');
    formDataMap.set('SHAPING', 'DEFAULT');
    formDataMap.set('API', 'JSON');
    formDataMap.set('SESSION', session);
    const result = await sendWebservicesRequest(formDataMap, process.env.WEBSERVICES_URI + '/callservice.pl', httpClient, "0");
    return result.RESULT.NEWCONTRACTNUMBER;
};

exports.sendInsuranceProposal = async function sendInsuranceProposal(session, insuranceProposalXML, httpClient = axiosWithCompleteLogging) {
    if (!session) {
        throw new Error(`request data not provided. Session: ${session}`);
    }
    const formDataMap = new Map();
    formDataMap.set('FUNCTION', 'SET_XML_INTERFACE');
    formDataMap.set('SHAPING', 'DEFAULT');
    formDataMap.set('API', 'JSON');
    formDataMap.set('SESSION', session);
    formDataMap.set('DATA', insuranceProposalXML);
    return await sendWebservicesRequest(formDataMap, process.env.WEBSERVICES_URI + '/callservice.pl', httpClient, "0");
};

async function sendWebservicesRequest(formDataMap, uri, httpClient, expectedStatusCode) {
    let response;
    const formData = new FormData();
    formDataMap.forEach((value, key) => {
        formData.append(key, value);
    });
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
    throw new WebserviceError(`Webservices did not answer with status code ${expectedStatusCode} for request: ${JSON.stringify(formDataMap)}. Webservices responded with: ${JSON.stringify(response.data, null, 2)}`);
}

class WebserviceError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}