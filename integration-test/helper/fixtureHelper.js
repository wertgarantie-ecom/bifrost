const signatureService = require('../../src/services/signatureService');
const clientService = require('../../src/services/clientService');
const uuid = require('uuid');

exports.createAndPersistDefaultClient = async function createAndPersistDefaultClient() {
    const addNewClientRequest = this.createDefaultClient();

    return await clientService.addNewClient(addNewClientRequest);
};

exports.createSignedShoppingCart = function createSignedShoppingCart(data = {}) {
    const {clientId = "public:" + uuid(), deviceClass = "fbfb2d44-4ff8-4579-9cc0-0a3ccb8d6f2d", devicePrice = 139999, shopProductId = "1", wertgarantieProductId = 1, wertgarantieProductName = 'Basic'} = data;
    const sessionId = uuid();
    const shoppingCart =
        {
            "sessionId": sessionId,
            "clientId": clientId,
            "products": [
                {
                    "wertgarantieProductId": wertgarantieProductId,
                    "wertgarantieProductName": wertgarantieProductName,
                    "shopProductId": shopProductId,
                    "deviceClass": deviceClass,
                    "devicePrice": devicePrice,
                    "deviceCurrency": "EUR",
                    "shopProductName": "E-Mountainbike Premium 3000",
                    "orderId": "e0accedd-b087-46df-899e-91229eb43747"
                }
            ],
            "legalAgeConfirmed": false,
            "termsAndConditionsConfirmed": false
        };

    return signatureService.signShoppingCart(shoppingCart);
};

exports.createDefaultClient = function createDefaultClient() {
    return {
        name: "testclient",
        heimdallClientId: "e4d3237c-7582-11ea-8602-9ba3368ccb31",
        webservices: {
            username: "testusername",
            password: "testpassword",
        },
        publicClientIds: [
            "public:testclient-publicId"
        ],
        secrets: [
            "secret:testclient-secret"
        ],
        activePartnerNumber: 12345,

    };
};

exports.createDefaultClientWithWebservicesConfiguration = function createDefaultClientWithWebservicesConfiguration() {
    return {
        name: "testclient",
        heimdallClientId: "e4d3237c-7582-11ea-8602-9ba3368ccb31",
        webservices: {
            username: "testusername",
            password: "testpassword",
        },
        publicClientIds: [
            "public:testclient-publicId"
        ],
        secrets: [
            "secret:testclient-secret"
        ],
        activePartnerNumber: 12345,
        basicRiskType: "KOMPLETTSCHUTZ",
        relevantProductTypes: {
            "KOMPLETTSCHUTZ_2019": {
                scalesOfPrices: [300, 800, 1800]
            }
        },
        productOfferConfigurations: [
            {
                advantages: [],
                risks: [],
                name: "Komplettschutz"
            },
            {
                advantages: ["Diebstahlschutz", "Cyberschutz", "ohne Selbstbeteiligung"],
                risks: ["DIEBSTAHLSCHUTZ"],
                name: "Komplettschutz mit Premium"
            }
        ],
        singlePaymentFeatures:{},
        recurringPaymentFeatures: {
            risks: []
        }
    };
};

