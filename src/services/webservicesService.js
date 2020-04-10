const _webservicesClient = require('./webservicesClient');
const _documentRespository = require('../repositories/documentRepository');
const _ = require('lodash');
const uuid = require('uuid');


async function selectRelevantWebservicesProducts(session, clientConfig, webservicesClient = _webservicesClient) {
    const productData = await webservicesClient.getAgentData(session);
    return _.filter(productData.RESULT.PRODUCT_LIST.PRODUCT, product => clientConfig.productOffersConfigurations.reduce((acc, productOfferConfig) => acc || productOfferConfig.productType === product.PRODUCT_TYPE && productOfferConfig.applicationCode === product.APPLICATION_CODE, false));
}


async function assembleAllProductOffers(clientConfig, webservicesClient = _webservicesClient) {
    const session = await webservicesClient.login(clientConfig);
    const allWebservicesProductsForClient = await selectRelevantWebservicesProducts(session, clientConfig, webservicesClient);
    return await Promise.all(clientConfig.productOffersConfigurations.map(config => assembleProductOffers(session, config, clientConfig.id, allWebservicesProductsForClient, webservicesClient)));
}


async function assembleProductOffers(session, productOfferConfig, clientId, allWebservicesProductsForClient, webservicesClient = _webservicesClient) {
    const webservicesProduct = await findProductFor(productOfferConfig, allWebservicesProductsForClient);
    if (!webservicesProduct) {
        return undefined;
    }
    return {
        name: productOfferConfig.name,
        id: uuid(),
        clientId: clientId,
        documents: await getDocuments(session, productOfferConfig, webservicesClient),
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
    return priceLimitation ? priceLimitation.AMOUNT : undefined;
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
                insurancePremium: result.RESULT.PREMIUM_RECURRING
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
    return await Promise.all(productOfferConfig.documentTypes.legalDocuments.map(async legalDocumentConfig => {
        const document = _.find(allLegalDocuments.RESULT.DOCUMENT, (document) => document.FILENAME.match(legalDocumentConfig.pattern));
        if (!document) {
            return undefined;
        }
        const documentID = await documentRespository.persistDocument(document);
        return {
            document_title: document.FILENAME,
            document_type: legalDocumentConfig.type,
            document_id: documentID
        };
    }));
}


async function getComparisonDocuments(session, productOfferConfig, webservicesClient = _webservicesClient, documentRespository = _documentRespository) {
    const allComparisonDocuments = await webservicesClient.getComparisonDocuments(session, productOfferConfig.applicationCode, productOfferConfig.productType); // liefert aktuell alle Dokumente in einem wieder...
    return await Promise.all(productOfferConfig.documentTypes.comparisonDocuments.map(async comparisonDocumentConfig => {
        const document = _.find(allComparisonDocuments.RESULT.DOCUMENTS.DOCUMENT, (document) => document.FILENAME.match(comparisonDocumentConfig.pattern));
        if (!document) {
            return undefined;
        }
        const documentID = await documentRespository.persistDocument(document);
        return {
            document_title: document.FILENAME,
            document_type: comparisonDocumentConfig.type,
            document_id: documentID
        };
    }));
}

exports.selectRelevantWebservicesProducts = selectRelevantWebservicesProducts;
exports.assembleAllProductOffers = assembleAllProductOffers;
exports.findProductFor = findProductFor;
exports.assembleProductOffers = assembleProductOffers;
exports.getDocuments = getDocuments;
exports.findMaxPriceForDeviceClass = findMaxPriceForDeviceClass;
exports.getIntervalPremiumsForPriceRanges = getIntervalPremiumsForPriceRanges;
exports.getDevicePremiums = getDevicePremiums;
exports.getLegalDocuments = getLegalDocuments;
exports.getComparisonDocuments = getComparisonDocuments;