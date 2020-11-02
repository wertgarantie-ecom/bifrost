import _ from 'lodash';
import {DeviceClassConfig, WebservicesProductConfig} from "./productOffersConfigSchema";
import {
    Document,
    PriceRangePremiums,
    Range,
    SupportedDevice,
    SupportedPaymentInterval,
    WebservicesProduct
} from "./webserviceProductOffersRepository";
import {mapIntervalCode, notUndefined} from "../../productoffers/productOffersService";

const _webservicesClient = require('./webservicesClient');
const _documentRespository = require('../../documents/documentRepository');

const _uuid = require('uuid');
const clientService = require('../../clientconfig/clientService');
const _productOfferRepository = require('./webserviceProductOffersRepository');
const validate = require('../../framework/validation/validator').validate;
const productOfferSchema = require('./webserviceProductOffersSchema').productOfferSchema;

interface WebservicesAgentDataProduct {
    BASIC_RISK: string,
    RISKS: {
        RISK: { RISK_NAME: string, RISK_TYPE: string }[]
    },
    APPLICATION_CODE: string,
    SIGNATURES: string,
    PURCHASE_PRICE_LIMITATIONS: {
        MAX_PRICE: {
            "OBJECT_DESCRIPTION": string,
            "AMOUNT": string,
            "OBJECT_CODE": string
        }[]
    }
    PRODUCT_TYPE: string,
    TERM: string,
    PRODUCT_NAME: string,
    PAYMENTINTERVALS: {
        INTERVAL: {
            VALUE: string,
            DESCRIPTION: string
        }[]
    }
}

interface WebservicesAgentDataResult {
    RESULT: {
        PRODUCT_LIST: {
            PRODUCT: WebservicesAgentDataProduct[]
        }
    }
}

interface WebserviceGeneralResponse {
    LANGUAGE: string,
    MAXAMOUNT: string,
    AMOUNT: string,
    STATUS: string,
    REQUEST_ID: string,
    ORDERBY: string,
    SORT: string,
    STATUSCODE: string,
    PAGE: string
}

type WebservicesAgentDataResponse = WebserviceGeneralResponse & WebservicesAgentDataResult


async function selectRelevantWebservicesProducts(sessionToken: string, clientConfig: any, webservicesClient = _webservicesClient): Promise<WebservicesAgentDataProduct[]> {
    const productData: WebservicesAgentDataResponse = await webservicesClient.getAgentData(sessionToken, clientConfig);
    const isRelevantProduct = (webservicesProductConfig: WebservicesProductConfig, product: WebservicesAgentDataProduct): boolean =>
        webservicesProductConfig.productType === product.PRODUCT_TYPE && webservicesProductConfig.applicationCode === product.APPLICATION_CODE
    const predicate = (product: WebservicesAgentDataProduct): boolean => clientConfig.backends.webservices.productOffersConfigurations.reduce(
        (acc: boolean, productOfferConfig: WebservicesProductConfig) => acc || isRelevantProduct(productOfferConfig, product), false)

    const products: WebservicesAgentDataProduct[] = productData.RESULT.PRODUCT_LIST.PRODUCT;
    return _.filter(products, predicate);
}

interface UpdateResults {
    success: SuccessUpdateResult[],
    failure: FailureUpdateResult[]
}


interface SuccessUpdateResult {
    clientId: string,
    clientName: string
}

type FailureUpdateResult = SuccessUpdateResult & { error: string }

interface ClientConfig {
    id: string,
    name: string,
    backends: {
        webservices: {
            productOffersConfigurations: WebservicesProductConfig[]
        }
    }
}

async function updateProductOffersForAllClients(clients: ClientConfig[]): Promise<UpdateResults> {
    if (!clients) {
        clients = await clientService.findAllClients();
    }
    const updateResults: UpdateResults = {
        success: [],
        failure: []
    };
    await Promise.all(clients.map(async client => {
        try {
            await updateAllProductOffersForClient(client);
            updateResults.success.push({
                clientId: client.id,
                clientName: client.name
            })
        } catch (error) {
            console.error("could not update product offers for client: " + client.id);
            updateResults.failure.push({
                clientId: client.id,
                clientName: client.name,
                error: JSON.stringify(error, null, 2)
            })
        }
    }));
    return updateResults;
}

async function updateAllProductOffersForClient(clientConfig: ClientConfig, uuid = _uuid, webservicesClient = _webservicesClient, productOfferRepository = _productOfferRepository, documentRepository = _documentRespository) {
    if (!clientConfig.backends.webservices.productOffersConfigurations || clientConfig.backends.webservices.productOffersConfigurations.length < 1) {
        return undefined;
    }
    const productOffers = await assembleAllProductOffersForClient(clientConfig, uuid, webservicesClient, documentRepository);
    productOffers.forEach(offer => {
        validate(offer, productOfferSchema);
    });
    return productOfferRepository.persist(productOffers);
}

async function assembleAllProductOffersForClient(clientConfig: ClientConfig, uuid = _uuid, webservicesClient = _webservicesClient, documentRepository = _documentRespository) {
    const webservicesClientConfig = clientConfig.backends.webservices;
    const session = await webservicesClient.login(webservicesClientConfig);
    const allWebservicesProductsForClient = await selectRelevantWebservicesProducts(session, clientConfig, webservicesClient);
    return await Promise.all(webservicesClientConfig.productOffersConfigurations
        .map(config => assembleProductOffer(session, config, clientConfig.id, allWebservicesProductsForClient, uuid, webservicesClient, documentRepository)))
        .then(offers => offers.filter(offer => offer !== undefined));
}


async function assembleProductOffer(session: string,
                                    productOfferConfig: WebservicesProductConfig,
                                    clientId: string,
                                    allWebservicesProductsForClient: WebservicesAgentDataProduct[],
                                    uuid = _uuid,
                                    webservicesClient = _webservicesClient,
                                    documentRepository = _documentRespository): Promise<WebservicesProduct | undefined> {
    const webservicesProduct = await findProductFor(productOfferConfig, allWebservicesProductsForClient);
    if (!webservicesProduct) {
        return undefined;
    }
    return {
        name: productOfferConfig.name,
        shortName: productOfferConfig.shortName,
        id: uuid(),
        applicationCode: productOfferConfig.applicationCode,
        risks: [productOfferConfig.basicRiskType, ...productOfferConfig.risks],
        productType: productOfferConfig.productType,
        clientId: clientId,
        defaultPaymentInterval: productOfferConfig.defaultPaymentInterval,
        documents: await getDocuments(session, productOfferConfig, webservicesClient, documentRepository),
        advantages: productOfferConfig.advantages,
        devices: await getDevicePremiums(session, productOfferConfig, webservicesProduct, webservicesClient),
        productImageLink: productOfferConfig.productImageLink,
        backgroundStyle: productOfferConfig.backgroundStyle,
        lock: productOfferConfig.lock
    };
}


function findProductFor(productOfferConfig: WebservicesProductConfig, allWebservicesProductsForClient: WebservicesAgentDataProduct[]): WebservicesAgentDataProduct | undefined {
    return _.find(allWebservicesProductsForClient, product => product.APPLICATION_CODE === productOfferConfig.applicationCode && product.PRODUCT_TYPE === productOfferConfig.productType);
}


async function getDocuments(session: string, productOfferConfig: WebservicesProductConfig, webservicesClient = _webservicesClient, documentRepository = _documentRespository): Promise<Document[]> {
    const documents = [];
    documents.push(...await getLegalDocuments(session, productOfferConfig, webservicesClient, documentRepository));
    return documents;
}


function findMaxPriceForDeviceClass(webservicesProduct: WebservicesAgentDataProduct, deviceClassConfig: DeviceClassConfig): number | undefined {
    const priceLimitation = _.find(webservicesProduct.PURCHASE_PRICE_LIMITATIONS.MAX_PRICE, limit => limit.OBJECT_CODE === deviceClassConfig.objectCode);
    return priceLimitation ? parseStringToMinorUnit(priceLimitation.AMOUNT) : undefined;
}

function parseStringToMinorUnit(string: string): number {
    const float = parseFloat(string.replace(",", "."));
    const minorUnits = float * 100;

    return Math.round(minorUnits);
}

async function getIntervalPremiumsForPriceRanges(session: string,
                                                 webservicesProduct: WebservicesAgentDataProduct,
                                                 deviceClassConfig: DeviceClassConfig,
                                                 priceRanges: Range[],
                                                 applicationCode: string,
                                                 productType: string,
                                                 riskTypes: string[],
                                                 webservicesClient = _webservicesClient): Promise<SupportedPaymentInterval[]> {
    return await Promise.all(webservicesProduct.PAYMENTINTERVALS.INTERVAL.map(async interval => {
        const intervalData: SupportedPaymentInterval = {
            intervalCode: interval.VALUE,
            description: interval.DESCRIPTION,
            priceRangePremiums: []
        };
        const priceRangePremiums: PriceRangePremiums[] = await Promise.all(priceRanges.map(async (range) => {
            const requestPrice = Math.round((range.maxOpen + range.minClose) / 2);
            const result = await webservicesClient.getInsurancePremium(session, applicationCode, productType, interval.VALUE, deviceClassConfig.objectCode, requestPrice, riskTypes);
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

function findMaxPriceFromPriceRanges(priceRanges: Range[]): number | undefined {
    return _.max(priceRanges.map(range => range.maxOpen));
}

async function getDevicePremiums(session: string, productOfferConfig: WebservicesProductConfig, webservicesProduct: WebservicesAgentDataProduct, webservicesClient = _webservicesClient) {
    return await Promise.all(productOfferConfig.deviceClasses.map(async deviceClassConfig => {
        const deviceClass: SupportedDevice = {
            objectCode: deviceClassConfig.objectCode,
            objectCodeExternal: deviceClassConfig.objectCodeExternal,
            maxPriceLimitation: findMaxPriceForDeviceClass(webservicesProduct, deviceClassConfig) || findMaxPriceFromPriceRanges(productOfferConfig.priceRanges),
            intervals: []
        };

        const riskTypesToConsider = [productOfferConfig.basicRiskType].concat(productOfferConfig.risks);
        const intervals = await getIntervalPremiumsForPriceRanges(session, webservicesProduct, deviceClassConfig, productOfferConfig.priceRanges, productOfferConfig.applicationCode, productOfferConfig.productType, riskTypesToConsider, webservicesClient);

        deviceClass.intervals.push(...intervals);
        return deviceClass;
    }));
}

type WebservicesLegalDocumentResponse = WebserviceLegalDocumentResult & WebserviceGeneralResponse

interface WebserviceLegalDocumentResult {
    "RESULT": {
        "DOCUMENT": WebservicesDocument[]
    }
}

interface WebservicesDocument {
    DOCUMENT_TYPE: string,
    FILENAME: string,
    CONTENT: string
}

async function getLegalDocuments(session: string,
                                 productOfferConfig: WebservicesProductConfig,
                                 webservicesClient = _webservicesClient,
                                 documentRespository = _documentRespository): Promise<Document[]> {

    async function persistWebservicesDocument(document: WebservicesDocument, type: string): Promise<string> {
        return documentRespository.persist({
            type: type,
            name: document.FILENAME,
            content: document.CONTENT
        });
    }

    async function extractAndPersistSupportedDocuments(allWebserviceLegalDocumentResponses: WebservicesLegalDocumentResponse): Promise<Document []> {
        const allSupportedDocuments = await Promise.all(productOfferConfig.documents.legalDocuments.map(async supportedType => {
            const document = _.find(allWebserviceLegalDocumentResponses.RESULT.DOCUMENT, (document: WebservicesDocument) => document.DOCUMENT_TYPE === supportedType);
            if (!document) {
                return undefined;
            }
            const documentID: string = await persistWebservicesDocument(document, supportedType);
            return {
                documentTitle: document.FILENAME,
                documentType: supportedType,
                documentId: documentID
            };
        }))
        return allSupportedDocuments.filter(notUndefined);
    }


    const response: WebservicesLegalDocumentResponse = await webservicesClient.getLegalDocuments(session, productOfferConfig.applicationCode, productOfferConfig.productType);
    return extractAndPersistSupportedDocuments(response);
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
exports.updateAllProductOffersForClient = updateAllProductOffersForClient;