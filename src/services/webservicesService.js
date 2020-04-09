const _webservicesClient = require('./webservicesClient');
const _documentRespository = require('../repositories/documentRepository');
const _ = require('lodash');
const uuid = require('uuid');

const documentType = {
    PRODUCT_INFORMATION_SHEET: "PIS", //Produktinformationsblatt
    GENERAL_INSURANCE_PRODUCTS_INFORMATION: "IPID", //Informationsblatt für Versicherungsprodukte
    GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE: "GTCI", // AVB
    LEGAL_NOTICE: "LN" // Rechtsdokumente
};

exports.getProductOffers = function getProductOffers() {
    // id --> uuid
};

async function selectRelevantWertgarantieProducts(session, clientConfig, webservicesClient = _webservicesClient) {
    const productData = await webservicesClient.getAgentData(session);
    return _.filter(productData.RESULT.PRODUCT_LIST.PRODUCT, product => clientConfig.productOffersConfigurations.reduce((acc, productOfferConfig) => acc || productOfferConfig.productType === product.PRODUCT_TYPE, false));
}

exports.selectRelevantWertgarantieProducts = selectRelevantWertgarantieProducts;

exports.assembleProductOffers = async function assembleProductOffers(clientConfig, webservicesClient = _webservicesClient) {
    const session = await webservicesClient.login(clientConfig);
    const relevantProducts = selectRelevantWertgarantieProducts(clientConfig, webservicesClient);


    const productOffers = await Promise.all(relevantProducts.map(async product => {
        const productOffer = {
            id: uuid(),
            clientId: clientConfig.publicClientIds[0],
            productType: product.PRODUCT_TYPE,
            applicationCode: product.APPLICATION_CODE,
            deviceClasses: [],
            documents: []
        };
        // get legal documents
        const legalDocuments = await getLegalDocuments(session, product.APPLICATION_CODE, product.PRODUCT_TYPE, clientConfig, webservicesClient);
        productOffer.documents = productOffer.documents.concat(legalDocuments);

        // pro versicherbarem product wollen wir sowas hier haben:
        /*
          deviceClass:
        * {
                "objectCode": "9025",
                "premiums": [
                    {
                        "Komplettschutz": {
                            1: [
                                {
                                    "maxProductPrice": 300,
                                    "insurancePrime": 5
                                },
                                {
                                    "maxProductPrice": 800,
                                    "insurancePrime": 8
                                },
                                {
                                    "maxProductPRice": 1800,
                                    "insurancePrime": 11
                                }
                            ]
                      }
                ]
            }
        * */
        // Wir brauchen doch schon bei uns ein Mapping von Shop-Product-Name zu OBJECT_CODE... bei der Jobanfrage haben wir ja noch keinen Produkt-Typ über die Selection Component rein bekommen und müssen uns darauf beziehen, was in der agent data steht...
        // Von daher hat das ganze Mapping bei den Webservices für uns eigentlich keinen Vorteil, da wir eh alle Anfragen aus unserem Cache bedienen werden...

        // frage pro riskType zusammensetzung (productOffers - configuration unten in clientConfig) die Versicherungsprämien für einzelne Preisstufen und Zahlungsintervalle ab
        const deviceClassPremiums = await Promise.all(clientConfig.productOfferConfigurations.map(async (productOfferConfig) => {
            const productOfferPremiumsPerInterval = {};
            const riskTypesToConsider = [clientConfig.basicRiskType].concat(productOfferConfig.risks);

            productOfferPremiumsPerInterval[productOfferConfig.name] = {};

            // frage pro payment interval...
            const premiums = await Promise.all(product.PAYMENTINTERVALS.INTERVAL.map(async (interval) => {
                // ... pro Preisstaffelgrenze premiums ab
                const intervalPremiums = {};
                intervalPremiums[interval.VALUE] = await Promise.all(clientConfig.relevantProductTypes[product.PRODUCT_TYPE].scalesOfPrices.map(async (maxPrice) => {
                    // setze Object Code = irgendein Code aus den Agent Data für dieses Versicherungsprodukt... Komplettschutz z. B. scheint sich ja für alle inkludierten Produkte gleich zu verhalten, oder? bis 300€ --> 5€, bis 800€ --> 8€ usw.
                    // ist das noch abhängig vom Object Code?
                    const result = await this.getInsurancePremium(session, product.APPLICATION_CODE, product.PRODUCT_TYPE, interval.VALUE, product.PURCHASE_PRICE_LIMITATIONS.MAX_PRICE[0].OBJECT_CODE, maxPrice, riskTypesToConsider, webservicesClient);
                    return {
                        maxProductPrice: maxPrice,
                        insurancePrime: result.RESULT.PREMIUM_RECURRING
                    };
                }));

                return intervalPremiums;
            }));
            premiums.map(premium => {
                const intervalValue = Object.keys(premium)[0];
                productOfferPremiumsPerInterval[productOfferConfig.name][intervalValue] = premium[intervalValue];
            });
            return productOfferPremiumsPerInterval;
        }));
        productOffer.deviceClasses = productOffer.deviceClasses.concat(deviceClassPremiums);
        return productOffer;
    }));
    return productOffers;
};

// for testing purposes
exports.getInsurancePremium = async function getInsurancePremium(session, applicationCode, productType, intervalValue, objectCode, objectPrice, riskTypes, webservicesClient = _webservicesClient) {
    return await webservicesClient.getInsurancePremium(session, applicationCode, productType, intervalValue, objectCode, objectPrice, riskTypes);
};

async function getLegalDocuments(session, applicationCode, productType, clientConfig, webservicesClient = _webservicesClient, documentRespository = _documentRespository) {
    const documentsResponse = await webservicesClient.getLegalDocuments(session, applicationCode, productType); // liefert aktuell alle Dokumente in einem wieder...
    clientConfig.relevantProductTypes

    const documentsForAppCode = _.filter(documentsResponse.RESULT.DOCUMENT, (document) => document.FILENAME.includes(applicationCode));

    return documentsForAppCode.map(async (document) => {

        const documentID = await documentRespository.persistDocument(document);
        // In Postgres-tabelle speichern --> zusammengesetzter primary key aus APPLICATION_CODE und document type
        // link und document type bestimmen (hoffentlich werden die documents nochmal gesplittet - Mail is raus)
        const documentType = clientConfig.relevantProductTypes[productType]
        return {
            document_title: document.FILENAME,
            document_type: type,
            document_id: documentID
        };
    });
}

exports.getLegalDocuments = getLegalDocuments;

const webservicesProductOffersConfig = {
    clientIdHandyFlash: {
        productOffersConfigurations: [
            {
                productType: "KOMPLETTSCHUTZ_2019",
                applicationCode: "GU WG DE KS 0419",
                basicRiskType: "KOMPLETTSCHUTZ",
                scalesOfPrices: [300, 800, 1800],
                documentTypes: {
                    legalDocuments: [
                        {
                            type: documentType.LEGAL_NOTICE,
                            pattern: 'GU WG DE KS 0419_RECHTSDOKUMENTE.PDF'
                        }
                    ],
                    comparisonDocuments: []
                },
                advantages: [],
                risks: [],
                name: "Komplettschutz"
            },
            {
                productType: "KOMPLETTSCHUTZ_2019",
                applicationCode: "GU WG DE KS 0419",
                basicRiskType: "KOMPLETTSCHUTZ",
                scalesOfPrices: [300, 800, 1800],
                documentTypes: {
                    legalDocuments: [
                        {
                            type: documentType.LEGAL_NOTICE,
                            pattern: 'GU WG DE KS 0419_RECHTSDOKUMENTE.PDF'
                        }
                    ],
                    comparisonDocuments: []
                },
                advantages: [],
                risks: ["DIEBSTAHLSCHUTZ"],
                name: "Komplettschutz mit Premium-Option"
            }
        ]
    }
    // ,
    // clientIdBOC: {
    //     productOfferConfigurations: [
    //         {
    //             interval: "monthly",
    //             name: "Schutz mit monatlicher Bezahlweise"
    //         },
    //         {
    //             interval: "yearly",
    //             name: "Schutz mit jährlicher Bezahlweise"
    //         }
    //     ],
    //     singlePaymentFeatures: {
    //         risks: ["SOFORTSCHUTZ"]
    //     },
    //     recurringPaymentFeatures: {
    //         risks: ["AKKUSCHUTZ"]
    //     }
    // }
};

const webservicesServiceProductOffers = [
    {
        "id": "uuid", // generated
        "clientId": "clientId",
        "productType": "KOMPLETTSCHUTZ_2019",
        "applicationCode": "GU WG BLA BLA",
        "riskTypes": [
            "KOMPLETTSCHUTZ"
        ],
        "name": "KOMPLETTSCHUTZ", //aus client config für Produkt --> selbst pflegen,
        "advantages": ["ADVERTISING_TEXT"], // + was auch immer wir in der client config mit pflegen
        "deviceClasses": [
            {
                "objectCode": "9025",
                "premiums": [
                    {
                        "Komplettschutz": {
                            monthly: [
                                {
                                    "maxProductPrice": 300,
                                    "insurancePrime": 5,
                                    "singlePaymentOptions": [],
                                },
                                {
                                    "maxProductPrice": 800,
                                    "insurancePrime": 8,
                                    "singlePaymentOptions": [],
                                },
                                {
                                    "maxProductPRice": 1800,
                                    "insurancePrime": 11,
                                    "singlePaymentOptions": [],
                                }
                            ],
                            quarterly: [
                                {
                                    "maxProductPrice": 300,
                                    "insurancePrime": 15,
                                    "singlePaymentOptions": [],
                                },
                                {
                                    "maxProductPrice": 800,
                                    "insurancePrime": 24,
                                    "singlePaymentOptions": [],
                                },
                                {
                                    "maxProductPRice": 1800,
                                    "insurancePrime": 33,
                                    "singlePaymentOptions": [],
                                }
                            ]
                        },
                        "Komplettschutz mit Premium-Option": {
                            monthly: [
                                {
                                    "maxProductPrice": 300,
                                    "insurancePrime": 6.95,
                                    "singlePaymentOptions": [],
                                },
                                {
                                    "maxProductPrice": 800,
                                    "insurancePrime": 9.95,
                                    "singlePaymentOptions": [],
                                },
                                {
                                    "maxProductPRice": 1800,
                                    "insurancePrime": 12.95,
                                    "singlePaymentOptions": [],
                                }
                            ],
                            quarterly: [
                                {
                                    "maxProductPrice": 300,
                                    "insurancePrime": 20.85,
                                    "singlePaymentOptions": [],
                                },
                                {
                                    "maxProductPrice": 800,
                                    "insurancePrime": 29.85,
                                    "singlePaymentOptions": [],
                                },
                                {
                                    "maxProductPRice": 1800,
                                    "insurancePrime": 38.85,
                                    "singlePaymentOptions": [],
                                }
                            ]
                        }
                    }
                ],
            }
        ],
        "documents": [ // COMPARISON_DOCUMENT + LEGAL_DOCUMENTS
            {
                "document_type": "",
                "document_title": "",
                "document_link": ""
            },
            {
                "document_type": "",
                "document_title": "",
                "document_link": ""
            }
        ]
    },
];

