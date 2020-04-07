const client = require('./webservicesClient');

exports.getProductOffers = function getProductOffers() {
    // id --> uuid
};

exports.assembleProductOffers = async function assembleProductOffers(clientConfig) {
    const session = await client.login(clientConfig);
    const productData = await client.getAgentData(session);

    const products = productData.RESULT.PRODUCT_LIST.PRODUCT;
    products.map(async product => {

        const advertisingTexts = await client.getAdvertisingTexts(session, product.APPLICATION_CODE, product.PRODUCT_TYPE);

    });


};


const webservicesProductOffersConfig = {
    clientIdHandyFlash: {
        basicRiskType: "KOMPLETTSCHUTZ",
        productOffers: [
            {
                risks: [],
                name: "Komplettschutz"
            },
            {
                risks: ["DIEBSTAHLSCHUTZ"],
                name: "Komplettschutz mit Premium"
            }
        ]
    },
    singlePaymentFeatures: {},
    recurringPaymentFeatures: {
        risks: []
    },
    clientIdBOC: {
        productOffers: [
            {
                interval: "monthly",
                name: "Schutz mit monatlicher Bezahlweise"
            },
            {
                interval: "yearly",
                name: "Schutz mit jährlicher Bezahlweise"
            }
        ]
    },
    singlePaymentFeatures: {
        risks: ["SOFORTSCHUTZ"]
    },
    recurringPaymentFeatures: {
        risks: ["AKKUSCHUTZ"]
    }
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
                "objectCodeExternal": "Smartphone",
                "priceRanges": [
                    {
                        monthly: [
                            {
                                "maxProductPrice": 300,
                                "insurancePrime": 5,
                            },
                            {
                                "maxProductPRice": 500,
                                "insurancePrime": 5,
                            },
                            {
                                "maxProductPrice": 800,
                                "insurancePrime": 8,
                            },
                            {
                                "maxProductPRice": 1800,
                                "insurancePrime": 11,
                            }
                        ]
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

