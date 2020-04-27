const addProductToShoppingCartWithOrderId = require('../../src/shoppingcart/shoppingCartService').addProductToShoppingCartWithOrderId;
const shoppingCartService = require('../../src/shoppingcart/shoppingCartService');
const signatureService = require('../../src/shoppingcart/signatureService');
const UnconfirmedShoppingCartError = require('../../src/shoppingcart/shoppingCartService').UnconfirmedShoppingCartError;
const uuid = require('uuid');
const validCustomer = require('../../integration-test/helper/fixtureHelper').validCustomer;

const clientConfig = {
    id: "testClientId",
    heimdallClientId: "e4d3237c-7582-11ea-8602-9ba3368ccb31",
    publicClientIds: [
        "public:" + "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f"
    ],
    productOffersConfigurations: [
        {
            deviceClasses: [
                {
                    objectCode: "9025",
                    objectCodeExternal: "0dc47b8a-f984-11e9-adcf-afabcc521093"
                }
            ]
        }
    ]
};

function validProductOrder() {
    return {
        wertgarantieProductId: 1234,
        shopDeviceClass: "0dc47b8a-f984-11e9-adcf-afabcc521093",
        devicePrice: 1200,
        shopProductName: "Phone X",
        orderId: "9fd47b8a-f984-11e9-adcf-afabcc521083"
    }
}

const includedProduct = {
    wertgarantieProductId: 4543545,
    wertgarantieDeviceClass: "9025",
    shopDeviceClass: "0dc47b8a-f984-11e9-adcf-afabcc521093",
    shopDeviceModel: "Phone X",
    shopDevicePrice: 1200,
    orderId: "5f507954-fed1-45c9-aaa6-30f216d6f163"
};
const validShoppingCart = {
    clientId: "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
    products: [includedProduct],
    legalAgeConfirmed: true,
    termsAndConditionsConfirmed: true
};

test("should create and fill new shopping cart if no cart is given", () => {
    expect(addProductToShoppingCartWithOrderId(undefined, validProductOrder(), clientConfig, "9fd47b8a-f984-11e9-adcf-afabcc521083").products).toEqual([validProductOrder()]);
});

test("new created shopping cart should have given clientId", () => {
    const clientId = uuid();
    expect(addProductToShoppingCartWithOrderId(undefined, validProductOrder(), clientId, "9fd47b8a-f984-11e9-adcf-afabcc521083").clientId).toEqual(clientId);
});

test("should add product to existing shopping cart", () => {
    expect(addProductToShoppingCartWithOrderId(validShoppingCart, validProductOrder(), "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f", "9fd47b8a-f984-11e9-adcf-afabcc521083").products).toEqual([includedProduct, validProductOrder()]);
});


test("should allow duplicate products", () => {
    let clientId = uuid();
    const validShoppingCart = {
        clientId: clientId,
        products: [validProductOrder()]
    };
    expect(addProductToShoppingCartWithOrderId(validShoppingCart, validProductOrder(), clientId, "9fd47b8a-f984-11e9-adcf-afabcc521083").products).toEqual([validProductOrder(), validProductOrder()]);
});

test("should confirm valid shopping cart", () => {
    let clientId = uuid();
    const validShoppingCart = {
        clientId: clientId,
        products: [validProductOrder()],
        confirmed: false
    };
    const confirmedShoppingCart = shoppingCartService.confirmAttribute(validShoppingCart, "confirmed");

    expect(confirmedShoppingCart.confirmed).toEqual(true);
});

test("should unconfirm valid shopping cart", () => {
    let clientId = uuid();
    const validShoppingCart = {
        clientId: clientId,
        products: [validProductOrder()],
        confirmed: false
    };
    const confirmedShoppingCart = shoppingCartService.unconfirmAttribute(validShoppingCart, clientId);

    expect(confirmedShoppingCart.confirmed).toEqual(false);
});

test("added product should always reject confirmation", () => {
    const shoppingCartWithAddedProduct = addProductToShoppingCartWithOrderId(validShoppingCart, validProductOrder(), "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f", "9fd47b8a-f984-11e9-adcf-afabcc521083");
    expect(shoppingCartWithAddedProduct.termsAndConditionsConfirmed).toEqual(false);
    expect(shoppingCartWithAddedProduct.legalAgeConfirmed).toEqual(false);
});


test("on checkout call shop price differs from wertgarantie price", async () => {
    const wertgarantieShoppingCart = {
        sessionId: "619f7fda-d77e-4be1-b73c-db145402bcab",
        clientId: "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
        products: [
            {
                wertgarantieProductId: "2",
                deviceClass: "bb3a615d-e92f-4d24-a4cc-22f8a87fc544",
                devicePrice: "1000",
                shopProductName: "IPhone X",
                orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
            }
        ],
        legalAgeConfirmed: true,
        termsAndConditionsConfirmed: true
    };

    const purchasedProducts = [
        {
            price: "1200.93",
            manufacturer: "Apple Inc",
            deviceClass: "bb3a615d-e92f-4d24-a4cc-22f8a87fc544",
            model: "IPhone X",
        }
    ];
    const customer = validCustomer();
    const secretClientId = "bikesecret1";

    const mockClient = jest.fn(() => {
        throw new Error("you should never call me");
    });

    const result = await shoppingCartService.checkoutShoppingCart(purchasedProducts,
        customer,
        wertgarantieShoppingCart,
        secretClientId,
        mockClient,
        generateIds(["2fcb053d-873c-4046-87e4-bbd75566901d"]),
        mockRepository);

    expect(result).toEqual({
        "sessionId": "619f7fda-d77e-4be1-b73c-db145402bcab",
        "traceId": "563e6720-5f07-42ad-99c3-a5104797f083",
        "clientId": "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
        "purchases": [
            {
                "id": "2fcb053d-873c-4046-87e4-bbd75566901d",
                "wertgarantieProductId": "2",
                "deviceClass": "bb3a615d-e92f-4d24-a4cc-22f8a87fc544",
                "devicePrice": "1000",
                "success": false,
                "message": "couldn't find matching product in shop cart for wertgarantie product",
                "shopProduct": "IPhone X",
                "availableShopProducts": [
                    {
                        "price": "1200.93",
                        "manufacturer": "Apple Inc",
                        "deviceClass": "bb3a615d-e92f-4d24-a4cc-22f8a87fc544",
                        "model": "IPhone X"
                    }
                ]
            }
        ]
    });
});

const mockRepository = {
    persist: (result) => result
};


function generateIds(ids) {
    return () => ids.pop();
}

test("checkout call executed without confirmation", async () => {
    const wertgarantieShoppingCart = {
        clientId: "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
        products: [
            {
                wertgarantieProductId: "2",
                shopProductId: "1",
                deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                devicePrice: "1000",
                shopProductName: "Super Bike",
                orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
            }
        ],
        confirmed: false
    };

    const signedWertgarantieCart = signatureService.signShoppingCart(wertgarantieShoppingCart);

    const purchasedProducts = [
        {
            price: "1000",
            manufacturer: "Apple Inc",
            deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
            model: "IPhone X",
            productId: "1"
        }
    ];
    const customer = validCustomer();
    const secretClientId = "bikesecret1";

    try {
        await shoppingCartService.checkoutShoppingCart(purchasedProducts, customer, signedWertgarantieCart, secretClientId);
        expect.fail();
    } catch (e) {
        expect(e).toBeInstanceOf(UnconfirmedShoppingCartError);
    }
});

