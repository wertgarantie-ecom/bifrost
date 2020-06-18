const shoppingCartService = require('../../src/shoppingcart/shoppingCartService');
const webservicesProductOffersAssembler = require('../../src/backends/webservices/webservicesProductOffersAssembler');
const mockWebservicesClient = require('../../test/helpers/webserviceMockClient').createMockWebserviceClientWithPhoneConfig();
const fixtureHelper = require('../helper/fixtureHelper');
const nockHelper = require('../helper/nockHelper');
const checkoutRepository = require('../../src/shoppingcart/checkoutRepository');

beforeAll(() => {
    process.env = Object.assign(process.env, {BACKEND: "webservices"});
});

describe("should submit insurance proposal and persist purchase data", () => {
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
                    name: "IPhone X",
                    deviceClass: "Smartphone",
                },
                id: "18ff0413-bcfd-48f8-b003-04b57762067a"
            }
        ],
        confirmations: {
            termsAndConditionsConfirmed: true
        }
    };

    const purchasedShopProducts = [
        {
            price: "1000",
            deviceClass: "Smartphone",
            name: "IPhone X",
        }
    ];
    const customer = fixtureHelper.validCustomer();
    const session = "DG21585917903JR99E8D45931QQ81J1TL3CX4Q49181L17Q921Z233GB6ER5XI";
    const contractNumber = "12345678";

    test("submit insurance proposal and persist data", async () => {
        clientConfig = await fixtureHelper.createAndPersistPhoneClientWithWebservicesConfiguration();
        const productOffers = await webservicesProductOffersAssembler.updateAllProductOffersForClient(clientConfig, undefined, mockWebservicesClient);
        wertgarantieShoppingCart.orders[0].wertgarantieProduct.id = productOffers[0].id;
        wertgarantieShoppingCart.orders[0].wertgarantieProduct.name = productOffers[0].name;

        nockHelper.nockWebservicesLogin(session);
        nockHelper.nockGetNewContractNumber(contractNumber);
        nockHelper.nockSubmitInsuranceProposal();

        const result = await shoppingCartService.checkoutShoppingCart(purchasedShopProducts, customer, undefined, wertgarantieShoppingCart, clientConfig);
        const purchase = result.purchases[0];
        expect(purchase.backend).toEqual("webservices");
        expect(purchase.wertgarantieProductName).toEqual("Komplettschutz");
        expect(purchase.deviceClass).toEqual(wertgarantieShoppingCart.orders[0].shopProduct.deviceClass);
        expect(purchase.success).toBe(true);
        expect(purchase.contractNumber).toEqual(contractNumber);
    });

    test("read purchase data from insurance proposal submit", async () => {
        const order = await checkoutRepository.findBySessionId(wertgarantieShoppingCart.sessionId);
        const purchase = order.purchases[0];
        expect(purchase.backend).toEqual("webservices");
        expect(purchase.wertgarantieProductName).toEqual("Komplettschutz");
        expect(purchase.deviceClass).toEqual(wertgarantieShoppingCart.orders[0].shopProduct.deviceClass);
        expect(purchase.success).toBe(true);
        expect(purchase.contractNumber).toEqual(contractNumber);
        expect(purchase.backendResponseInfo).toEqual({
            "requestId": "98889510",
            "statusCode": "3",
            "statusText": "Verarbeitet"
        })
    });
});