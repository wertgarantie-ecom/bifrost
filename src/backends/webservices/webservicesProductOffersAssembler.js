const _webservicesClient = require('./webservicesClient');
const _documentRespository = require('../../documents/documentRepository');
const _ = require('lodash');
const _uuid = require('uuid');
const clientService = require('../../clientconfig/clientService');
const _productOfferRepository = require('./webserviceProductOffersRepository');
const validate = require('../../framework/validation/validator').validate;
const productOfferSchema = require('./webserviceProductOffersSchema').productOfferSchema;


async function selectRelevantWebservicesProducts(session, clientConfig, webservicesClient = _webservicesClient) {
    const productData = await webservicesClient.getAgentData(session, clientConfig);
    return _.filter(productData.RESULT.PRODUCT_LIST.PRODUCT, product => clientConfig.backends.webservices.productOffersConfigurations.reduce((acc, productOfferConfig) => acc || productOfferConfig.productType === product.PRODUCT_TYPE && productOfferConfig.applicationCode === product.APPLICATION_CODE, false));
}

async function updateProductOffersForAllClients(clients) {
    if (!clients) {
        clients = await clientService.findAllClients();
    }

    await Promise.all(clients.map(async client => {
        try {
            await updateAllProductOffersForClient(client);
        } catch (error) {
            console.error("could not update product offers for client: " + client.id);
        }
    }));
}

async function updateAllProductOffersForClient(clientConfig, uuid = _uuid, webservicesClient = _webservicesClient, productOfferRepository = _productOfferRepository, documentRepository = _documentRespository) {
    if (!clientConfig.backends.webservices.productOffersConfigurations || clientConfig.backends.webservices.productOffersConfigurations.length < 1) {
        return undefined;
    }
    const productOffers = await assembleAllProductOffersForClient(clientConfig, uuid, webservicesClient, documentRepository);
    productOffers.forEach(offer => {
        validate(offer, productOfferSchema);
    });
    return productOfferRepository.persist(productOffers);
}

async function assembleAllProductOffersForClient(clientConfig, uuid = _uuid, webservicesClient = _webservicesClient, documentRepository = _documentRespository) {
    const webservicesClientConfig = clientConfig.backends.webservices;
    const session = await webservicesClient.login(webservicesClientConfig);
    const allWebservicesProductsForClient = await selectRelevantWebservicesProducts(session, clientConfig, webservicesClient);
    return await Promise.all(webservicesClientConfig.productOffersConfigurations
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
        risks: [productOfferConfig.basicRiskType, ...productOfferConfig.risks],
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
                insurancePremium: parseStringToMinorUnit(result.RESULT.PREMIUM_RECURRING_INTERVAL)
            };
        }));
        intervalData.priceRangePremiums.push(...priceRangePremiums);
        return intervalData;
    }));
}

function findMaxPriceFromPriceRanges(deviceClassConfig) {
    return _.max(deviceClassConfig.priceRanges.map(range => range.maxOpen));
}

async function getDevicePremiums(session, productOfferConfig, webservicesProduct, webservicesClient = _webservicesClient) {
    return await Promise.all(productOfferConfig.deviceClasses.map(async deviceClassConfig => {
        const deviceClass = {
            objectCode: deviceClassConfig.objectCode,
            objectCodeExternal: deviceClassConfig.objectCodeExternal,
            maxPriceLimitation: findMaxPriceForDeviceClass(webservicesProduct, deviceClassConfig) || findMaxPriceFromPriceRanges(deviceClassConfig),
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
        const document = _.find(allLegalDocuments.RESULT.DOCUMENT, (document) => document.DOCUMENT_TYPE.match(legalDocumentConfig));
        if (!document) {
            return undefined;
        }
        document.type = legalDocumentConfig;
        const documentID = await documentRespository.persist(document);
        return {
            documentTitle: document.FILENAME,
            documentType: legalDocumentConfig,
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
        document.type = comparisonDocumentConfig.type;
        const documentID = await documentRespository.persist(document);
        return {
            documentTitle: document.FILENAME,
            documentType: comparisonDocumentConfig.type,
            documentId: documentID
        };
    }));
}

exports.updateProductOffersForAllClients = updateProductOffersForAllClients;
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