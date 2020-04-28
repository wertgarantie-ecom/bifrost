const shoppingCartService = require('../../src/shoppingcart/shoppingCartService');
const fixtureHelper = require('../helper/fixtureHelper');
const nockHelper = require('../helper/fixtureHelper');

describe("should submit insurance proposal and persist purchase data", () => {
    process.env.BACKEND = "webservices";
    let clientConfig;
    const wertgarantieShoppingCart = {
        sessionId: "619f7fda-d77e-4be1-b73c-db145402bcab",
        publicClientId: "public:5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
        orders: [
            {
                wertgarantieProduct: {
                    id: "2",
                    name: "Basis",
                    paymentInterval: "monthly"
                },
                shopProduct: {
                    price: "1000",
                    model: "IPhone X",
                    deviceClass: "Smartphone",
                },
                id: "18ff0413-bcfd-48f8-b003-04b57762067a"
            }
        ],
        confirmations: {
            legalAgeConfirmed: true,
            termsAndConditionsConfirmed: true
        }
    };

    const purchasedShopProducts = [
        {
            price: "1000",
            manufacturer: "Apple Inc",
            deviceClass: "Smartphone",
            model: "IPhone X",
        }
    ];
    const customer = fixtureHelper.validCustomer();

    test("submit insurance proposal and persist data", async () => {
        clientConfig = await fixtureHelper.createAndPersistDefaultClientWithWebservicesConfiguration();
        const result = await shoppingCartService.checkoutShoppingCart(purchasedShopProducts, customer, wertgarantieShoppingCart, clientConfig);

        // const result2 = {
        //     id: idGenerator(),
        //     wertgarantieProductId: order.wertgarantieProduct.id,
        //     wertgarantieProductName: order.wertgarantieProduct.name,
        //     deviceClass: order.shopProduct.deviceClass,
        //     devicePrice: order.shopProduct.price,
        //     success: true,
        //     message: "successfully transmitted insurance proposal",
        //     shopProduct: order.shopProduct.model,
        //     contractNumber: contractnumber,
        //     transactionNumber: satznummer,
        //     backend: "webservices",
        //     backendResponseInfo: submitResult.STATUS_TEXT
        // }
    });

    test("read purchase data from insurance proposal submit", async () => {

    });
    process.env.BACKEND = "heimdall";
});