const _webservicesClient = require('./webservicesClient');
const _documentRespository = require('../repositories/documentRepository');
const _ = require('lodash');
const _uuid = require('uuid');
const clientService = require('./clientService');
const _productOfferRepository = require('../repositories/productOffersRepository');
const jsonschema = require('jsonschema');
const productOfferSchema = require('../schemas/productOfferSchema').productOfferSchema;


async function selectRelevantWebservicesProducts(session, clientConfig, webservicesClient = _webservicesClient) {
    const productData = await webservicesClient.getAgentData(session, clientConfig);
    return _.filter(productData.RESULT.PRODUCT_LIST.PRODUCT, product => clientConfig.productOffersConfigurations.reduce((acc, productOfferConfig) => acc || productOfferConfig.productType === product.PRODUCT_TYPE && productOfferConfig.applicationCode === product.APPLICATION_CODE, false));
}

async function updateProductOffersForAllClients(clients) {
    if (!clients) {
        clients = await clientService.findAllClients();
    }

    clients.map(client => {
        updateAllProductOffersForClient(client);
    });
}

async function updateAllProductOffersForClient(clientConfig, uuid = _uuid, webservicesClient = _webservicesClient, productOfferRepository = _productOfferRepository, documentRepository = _documentRespository) {
    if (!clientConfig.productOffersConfigurations) {
        return undefined;
    }
    const productOffers = await assembleAllProductOffersForClient(clientConfig, uuid, webservicesClient, documentRepository);
    productOffers.forEach(offer => {
        const validationResult = jsonschema.validate(offer, productOfferSchema);
        if (!validationResult.valid) {
            const error = new Error();
            error.name = "ValidationError";
            error.errors = validationResult.errors;
            error.instance = validationResult.instance;
            error.message = JSON.stringify(validationResult.errors, null, 2);
            throw error;
        }
    });
    return productOfferRepository.persist(productOffers);
}

async function assembleAllProductOffersForClient(clientConfig, uuid = _uuid, webservicesClient = _webservicesClient, documentRepository = _documentRespository) {
    const session = await webservicesClient.login(clientConfig);
    const allWebservicesProductsForClient = await selectRelevantWebservicesProducts(session, clientConfig, webservicesClient);
    return await Promise.all(clientConfig.productOffersConfigurations
        .map(config => assembleProductOffer(session, config, clientConfig.id, allWebservicesProductsForClient, uuid, webservicesClient, documentRepository)))
        .then(offers => offers.filter(offer => offer !== undefined));
}


async function assembleProductOffer(session, productOfferConfig, clientId, allWebservicesProductsForClient, uuid = _uuid, webservicesClient = _webservicesClient, documentRepository = _documentRespository) {
    const webservicesProduct = await findProductFor(productOfferConfig, allWebservicesProductsForClient);
    if (!webservicesProduct) {
        return undefined;
    }
    return {
        name: productOfferConfig.name,
        id: uuid(),
        applicationCode: productOfferConfig.applicationCode,
        risks: productOfferConfig.risks,
        productType: productOfferConfig.productType,
        clientId: clientId,
        defaultPaymentInterval: productOfferConfig.defaultPaymentInterval,
        documents: await getDocuments(session, productOfferConfig, webservicesClient, documentRepository),
        advantages: productOfferConfig.advantages,
        devices: await getDevicePremiums(session, productOfferConfig, webservicesProduct, webservicesClient)
    };
}


async function findProductFor(productOfferConfig, allWebservicesProductsForClient) {
    return _.find(allWebservicesProductsForClient, product => product.APPLICATION_CODE === productOfferConfig.applicationCode && product.PRODUCT_TYPE === productOfferConfig.productType);
}


async function getDocuments(session, productOfferConfig, webservicesClient = _webservicesClient, documentRepository = _documentRespository) {
    const documents = [];
    documents.push(...await getLegalDocuments(session, productOfferConfig, webservicesClient, documentRepository));
    documents.push(...await getComparisonDocuments(session, productOfferConfig, webservicesClient, documentRepository));
    return documents;
}


function findMaxPriceForDeviceClass(webservicesProduct, deviceClassConfig) {
    const priceLimitation = _.find(webservicesProduct.PURCHASE_PRICE_LIMITATIONS.MAX_PRICE, limit => limit.OBJECT_CODE === deviceClassConfig.objectCode);
    return priceLimitation ? parseStringToMinorUnit(priceLimitation.AMOUNT) : undefined;
}

function parseStringToMinorUnit(string) {
    const float = parseFloat(string.replace(",", "."));
    const minorUnits = float * 100;

    return Math.round(minorUnits);
}

async function getIntervalPremiumsForPriceRanges(session, webservicesProduct, deviceClassConfig, applicationCode, productType, riskTypes, webservicesClient = _webservicesClient) {
    return await Promise.all(webservicesProduct.PAYMENTINTERVALS.INTERVAL.map(async interval => {
        const intervalData = {
            intervalCode: interval.VALUE,
            description: interval.DESCRIPTION,
            priceRangePremiums: []
        };
        // pro Intervall für jede Price Range premiums abfragen
        const priceRangePremiums = await Promise.all(deviceClassConfig.priceRanges.map(async (range) => {
            const result = await webservicesClient.getInsurancePremium(session, applicationCode, productType, interval.VALUE, deviceClassConfig.objectCode, range.maxOpen, riskTypes);
            return {
                minClose: range.minClose,
                maxOpen: range.maxOpen,
                insurancePremium: parseStringToMinorUnit(result.RESULT.PREMIUM_RECURRING)
            };
        }));
        intervalData.priceRangePremiums.push(...priceRangePremiums);
        return intervalData;
    }));
}


async function getDevicePremiums(session, productOfferConfig, webservicesProduct, webservicesClient = _webservicesClient) {
    return await Promise.all(productOfferConfig.deviceClasses.map(async deviceClassConfig => {
        const deviceClass = {
            objectCode: deviceClassConfig.objectCode,
            objectCodeExternal: deviceClassConfig.objectCodeExternal,
            maxPriceLimitation: findMaxPriceForDeviceClass(webservicesProduct, deviceClassConfig),
            intervals: []
        };

        const riskTypesToConsider = [productOfferConfig.basicRiskType].concat(productOfferConfig.risks);
        const intervals = await getIntervalPremiumsForPriceRanges(session, webservicesProduct, deviceClassConfig, productOfferConfig.applicationCode, productOfferConfig.productType, riskTypesToConsider, webservicesClient);

        deviceClass.intervals.push(...intervals);
        return deviceClass;
    }));
}


async function getLegalDocuments(session, productOfferConfig, webservicesClient = _webservicesClient, documentRespository = _documentRespository) {
    const allLegalDocuments = await webservicesClient.getLegalDocuments(session, productOfferConfig.applicationCode, productOfferConfig.productType); // liefert aktuell alle Dokumente in einem wieder...
    return await Promise.all(productOfferConfig.documents.legalDocuments.map(async legalDocumentConfig => {
        const document = _.find(allLegalDocuments.RESULT.DOCUMENT, (document) => document.FILENAME.match(legalDocumentConfig.pattern));
        if (!document) {
            return undefined;
        }
        const documentID = await documentRespository.persist(document);
        return {
            documentTitle: document.FILENAME,
            documentType: legalDocumentConfig.type,
            documentId: documentID
        };
    }));
}


async function getComparisonDocuments(session, productOfferConfig, webservicesClient = _webservicesClient, documentRespository = _documentRespository) {
    const allComparisonDocuments = await webservicesClient.getComparisonDocuments(session, productOfferConfig.applicationCode, productOfferConfig.productType); // liefert aktuell alle Dokumente in einem wieder...
    return await Promise.all(productOfferConfig.documents.comparisonDocuments.map(async comparisonDocumentConfig => {
        const document = _.find(allComparisonDocuments.RESULT.DOCUMENTS.DOCUMENT, (document) => document.FILENAME.match(comparisonDocumentConfig.pattern));
        if (!document) {
            return undefined;
        }
        const documentID = await documentRespository.persist(document);
        return {
            documentTitle: document.FILENAME,
            documentType: comparisonDocumentConfig.type,
            documentId: documentID
        };
    }));
}

exports.selectRelevantWebservicesProducts = selectRelevantWebservicesProducts;
exports.assembleAllProductOffersForClient = assembleAllProductOffersForClient;
exports.findProductFor = findProductFor;
exports.assembleProductOffer = assembleProductOffer;
exports.getDocuments = getDocuments;
exports.findMaxPriceForDeviceClass = findMaxPriceForDeviceClass;
exports.getIntervalPremiumsForPriceRanges = getIntervalPremiumsForPriceRanges;
exports.getDevicePremiums = getDevicePremiums;
exports.getLegalDocuments = getLegalDocuments;
exports.getComparisonDocuments = getComparisonDocuments;
exports.updateAllProductOffersForClient = updateAllProductOffersForClient;