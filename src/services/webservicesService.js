const documentTypes = require('./documentTypes').documentTypes;
const _webservicesClient = require('./webservicesClient');
const _documentRespository = require('../repositories/documentRepository');
const _ = require('lodash');
const uuid = require('uuid');

exports.getProductOffers = function getProductOffers() {
    // id --> uuid
};

async function selectRelevantWertgarantieProducts(session, clientConfig, webservicesClient = _webservicesClient) {
    const productData = await webservicesClient.getAgentData(session);
    return _.filter(productData.RESULT.PRODUCT_LIST.PRODUCT, product => clientConfig.productOffersConfigurations.reduce((acc, productOfferConfig) => acc || productOfferConfig.productType === product.PRODUCT_TYPE, false));
}

exports.selectRelevantWertgarantieProducts = selectRelevantWertgarantieProducts;

async function assembleAllProductOffers(clientConfig, webservicesClient = _webservicesClient) {
    const session = await webservicesClient.login(clientConfig);
    const allWebservicesProductsForClient = await webservicesClient.getAgentData(session);
    return await Promise.all(clientConfig.productOffersConfigurations.map(config => assembleProductOffers(session, config, clientConfig.id, allWebservicesProductsForClient)));
}

async function assembleProductOffers(session, productOfferConfig, clientId, allWebservicesProductsForClient) {
    const webservicesProduct = await findProductFor(productOfferConfig, allWebservicesProductsForClient);
    if (!webservicesProduct) {
        return undefined;
    }
    return {
        name: productOfferConfig.name,
        id: uuid(),
        clientId: clientId,
        documents: await getDocuments(session, productOfferConfig),
        advantages: productOfferConfig.advantages,
        devices: await getDevicePremiums(session, productOfferConfig, webservicesProduct)
    };
}

exports.assembleProductOffers = assembleProductOffers;

async function findProductFor(productOfferConfig, allWebservicesProductsForClient) {
    return _.find(allWebservicesProductsForClient, product => product.APPLICATION_CODE === productOfferConfig.applicationCode && product.PRODUCT_TYPE === productOfferConfig.productType);
}

exports.findProductFor = findProductFor;

async function getDocuments(session, productOfferConfig) {
    const documents = [];
    documents.push(...getLegalDocuments(session, productOfferConfig,));
    documents.push(...getComparisonDocuments());
    return documents;
}

exports.getDocuments = getDocuments;

function findMaxPriceForDeviceClass(webservicesProduct, deviceClassConfig) {
    const priceLimitation = _.find(webservicesProduct.PURCHASE_PRICE_LIMITATIONS.MAX_PRICE, limit => limit.OBJECT_CODE === deviceClassConfig.objectCode);
    return priceLimitation ? priceLimitation.AMOUNT : undefined;
}

async function getDevicePremiums(session, productOfferConfig, webservicesProduct, webservicesClient = _webservicesClient) {
    return productOfferConfig.deviceClasses.map(deviceClassConfig => {
        const deviceClass = {
            objectCode: deviceClassConfig.objectCode,
            objectCodeExternal: deviceClassConfig.objectCodeExternal,
            maxPriceLimitation: findMaxPriceForDeviceClass(webservicesProduct, deviceClassConfig),
            intervals: []
        };

        const riskTypesToConsider = [clientConfig.basicRiskType].concat(productOfferConfig.risks);


        const intervals = PAYMENTINTERVALS.INTERVAL.map(async interval => {
            // ... pro Preisstaffelgrenze premiums ab
            const intervalPremiums = {};
            intervalPremiums[interval.VALUE] = await Promise.all(clientConfig.relevantProductTypes[product.PRODUCT_TYPE].priceRanges.map(async (range) => {
                // setze Object Code = irgendein Code aus den Agent Data für dieses Versicherungsprodukt... Komplettschutz z. B. scheint sich ja für alle inkludierten Produkte gleich zu verhalten, oder? bis 300€ --> 5€, bis 800€ --> 8€ usw.
                // ist das noch abhängig vom Object Code?
                const result = await this.getInsurancePremium(session, product.APPLICATION_CODE, product.PRODUCT_TYPE, interval.VALUE, product.PURCHASE_PRICE_LIMITATIONS.MAX_PRICE[0].OBJECT_CODE, range.maxPrice, riskTypesToConsider, webservicesClient);
                return {
                    minClose: range.minClose,
                    maxOpen: scale.maxOpen,
                    insurancePrime: result.RESULT.PREMIUM_RECURRING
                };
            }));

            deviceClass.intervals.push(...intervals);
        })

    });
}

exports.getDevicePremiums = getDevicePremiums;


async function assembleProductOffers(clientConfig, webservicesClient = _webservicesClient) {
    const session = await webservicesClient.login(clientConfig);
    const relevantProducts = selectRelevantWertgarantieProducts(clientConfig, webservicesClient);


    return await Promise.all(relevantProducts.map(async product => {
        const productOffer = {
            id: uuid(),
            clientId: clientConfig.publicClientIds[0],
            productType: product.PRODUCT_TYPE,
            applicationCode: product.APPLICATION_CODE,
            deviceClasses: [],
            documents: []
        };
    }));
}

// for testing purposes
exports.getInsurancePremium = async function getInsurancePremium(session, applicationCode, productType, intervalValue, objectCode, objectPrice, riskTypes, webservicesClient = _webservicesClient) {
    return await webservicesClient.getInsurancePremium(session, applicationCode, productType, intervalValue, objectCode, objectPrice, riskTypes);
};

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

exports.getLegalDocuments = getLegalDocuments;

async function getComparisonDocuments(session, productOfferConfig, webservicesClient = _webservicesClient, documentRespository = _documentRespository) {
    const allComparisonDocuments = await webservicesClient.getLegalDocuments(session, productOfferConfig.applicationCode, productOfferConfig.productType); // liefert aktuell alle Dokumente in einem wieder...
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

// pro Device Class  habe ich N Intervalle, pro Intervall habe ich X price scales = N * X Abfragen der Prämien pro Offer
exports.getComparisonDocuments = getComparisonDocuments;

const sampleConfig = {
    clientIdHandyFlash: {
        productOffersConfigurations: [
            {
                name: "Komplettschutz",
                productType: "KOMPLETTSCHUTZ_2019",
                applicationCode: "GU WG DE KS 0419",
                basicRiskType: "KOMPLETTSCHUTZ",
                deviceClasses: [
                    {
                        objectCode: 9025,
                        externalObjectCode: "Smartphone",
                        priceRanges: [
                            {
                                min: 0,
                                max: 300
                            },
                            {
                                min: 300,
                                max: 800
                            },
                            {
                                min: 800,
                                max: 1800
                            }]
                    },
                    {
                        objectCode: 73,
                        externalObjectCode: "Mobilfunk",
                        priceRanges: [
                            {
                                min: 0,
                                max: 300
                            },
                            {
                                min: 300,
                                max: 800
                            },
                            {
                                min: 800,
                                max: 1800
                            }]
                    }

                ],
                documentTypes: {
                    legalDocuments: [
                        {
                            type: documentTypes.LEGAL_NOTICE,
                            pattern: 'GU WG DE KS 0419_RECHTSDOKUMENTE.PDF'
                        }
                    ],
                    comparisonDocuments: []
                },
                advantages: [],
                risks: []
            },
            {
                name: "Komplettschutz mit Premium-Option",
                productType: "KOMPLETTSCHUTZ_2019",
                applicationCode: "GU WG DE KS 0419",
                basicRiskType: "KOMPLETTSCHUTZ",
                deviceClasses: [
                    {
                        objectCode: 9025,
                        externalObjectCode: "Smartphone",
                        scalesOfPrices:
                            [
                                {
                                    min: 0,
                                    max: 300
                                },
                                {
                                    min: 300,
                                    max: 800
                                },
                                {
                                    min: 800,
                                    max: 1800
                                }

                            ]
                    },
                    {
                        objectCode: 73,
                        externalObjectCode: "Mobilfunk",
                        scalesOfPrices: [300, 800, 1800]
                    }

                ],
                documentTypes: {
                    legalDocuments: [
                        {
                            type: documentTypes.LEGAL_NOTICE,
                            pattern: 'GU WG DE KS 0419_RECHTSDOKUMENTE.PDF'
                        }
                    ],
                    comparisonDocuments: []
                },
                advantages: [],
                risks: ["DIEBSTAHLSCHUTZ"]
            }
        ]
    }
};


