const addProductToShoppingCartWithOrderId = require('../../src/shoppingcart/shoppingCartService').addProductToShoppingCartWithOrderId;
const shoppingCartService = require('../../src/shoppingcart/shoppingCartService');
const signatureService = require('../../src/shoppingcart/signatureService');
const ClientError = require('../../src/errors/ClientError');
const uuid = require('uuid');
const validCustomer = require('../../integration-test/helper/fixtureHelper').validCustomer;
const clientConfig = require('../../integration-test/helper/fixtureHelper').createDefaultClient();


function validProduct() {
    return {
        orderId: "9fd47b8a-f984-11e9-adcf-afabcc521083",
        shopProduct: {
            model: "Phone X",
            deviceClass: "Smartphone",
            price: 1200
        },
        wertgarantieProduct: {
            id: "1234",
            name: "Komplettschutz",
            paymentInterval: "monthly"
        }
    };
}

const includedOrder = {
    orderId: "5f507954-fed1-45c9-aaa6-30f216d6f163",
    shopProduct: {
        model: "Phone X",
        deviceClass: "Smartphone",
        price: 1200
    },
    wertgarantieProduct: {
        id: "4543545",
        name: "Komplettschutz",
        paymentInterval: "monthly"
    }
};
const validShoppingCart = {
    clientId: "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
    orders: [includedOrder],
    confirmations: {
        legalAgeConfirmed: true,
        termsAndConditionsConfirmed: true
    }
};

test("should create and fill new shopping cart if no cart is given", () => {
    expect(addProductToShoppingCartWithOrderId(undefined, validProduct(), "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f", "9fd47b8a-f984-11e9-adcf-afabcc521083").orders).toEqual([validProduct()]);
});

test("new created shopping cart should have given clientId", () => {
    const clientId = uuid();
    expect(addProductToShoppingCartWithOrderId(undefined, validProduct(), clientId, "9fd47b8a-f984-11e9-adcf-afabcc521083").publicClientId).toEqual(clientId);
});

test("should add product to existing shopping cart", () => {
    expect(addProductToShoppingCartWithOrderId(validShoppingCart, validProduct(), "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f", "9fd47b8a-f984-11e9-adcf-afabcc521083").orders).toEqual([includedOrder, validProduct()]);
});


test("should allow duplicate products", () => {
    let clientId = uuid();
    const validShoppingCart = {
        clientId: clientId,
        orders: [validProduct()],
        confirmations: {
            legalAgeConfirmed: false,
            termsAndConditionsConfirmed: false
        }
    };
    expect(addProductToShoppingCartWithOrderId(validShoppingCart, validProduct(), clientId, "9fd47b8a-f984-11e9-adcf-afabcc521083").orders).toEqual([validProduct(), validProduct()]);
});

test("should confirm valid shopping cart", () => {
    let clientId = uuid();
    const validShoppingCart = {
        clientId: clientId,
        products: [validProduct()],
        confirmations: {
            legalAgeConfirmed: false,
            termsAndConditionsConfirmed: true
        }
    };
    const confirmedShoppingCart = shoppingCartService.confirmAttribute(validShoppingCart, "legalAgeConfirmed");

    expect(confirmedShoppingCart.confirmations.legalAgeConfirmed).toEqual(true);
});

test("should unconfirm valid shopping cart", () => {
    let clientId = uuid();
    const validShoppingCart = {
        clientId: clientId,
        products: [validProduct()],
        confirmations: {
            legalAgeConfirmed: true,
            termsAndConditionsConfirmed: true
        }
    };
    const confirmedShoppingCart = shoppingCartService.unconfirmAttribute(validShoppingCart, "termsAndConditionsConfirmed");

    expect(confirmedShoppingCart.confirmations.legalAgeConfirmed).toEqual(true);
    expect(confirmedShoppingCart.confirmations.termsAndConditionsConfirmed).toEqual(false);
});

test("added product should always reject confirmation", () => {
    const shoppingCartWithAddedProduct = addProductToShoppingCartWithOrderId(validShoppingCart, validProduct(), "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f", "9fd47b8a-f984-11e9-adcf-afabcc521083");
    expect(shoppingCartWithAddedProduct.confirmations.termsAndConditionsConfirmed).toEqual(false);
    expect(shoppingCartWithAddedProduct.confirmations.legalAgeConfirmed).toEqual(false);
});


test("on checkout call shop price differs from wertgarantie price", async () => {
    const wertgarantieShoppingCart = {
        sessionId: "619f7fda-d77e-4be1-b73c-db145402bcab",
        clientId: "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
        orders: [
            {
                wertgarantieProduct: {
                    id: "2",
                    name: "Basis"
                },
                shopProduct: {
                    price: "1000",
                    model: "IPhone X",
                    deviceClass: "bb3a615d-e92f-4d24-a4cc-22f8a87fc544",
                },
                id: "18ff0413-bcfd-48f8-b003-04b57762067a"
            }
        ],
        confirmations: {
            legalAgeConfirmed: true,
            termsAndConditionsConfirmed: true
        }
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

    const mockClient = jest.fn(() => {
        throw new Error("you should never call me");
    });

    const result = await shoppingCartService.checkoutShoppingCart(purchasedProducts,
        customer,
        wertgarantieShoppingCart,
        clientConfig,
        mockClient,
        generateIds(["2fcb053d-873c-4046-87e4-bbd75566901d"]),
        mockRepository);

    expect(result).toEqual({
        "sessionId": "619f7fda-d77e-4be1-b73c-db145402bcab",
        "traceId": "563e6720-5f07-42ad-99c3-a5104797f083",
        "clientId": clientConfig.id,
        "purchases": [
            {
                "id": "2fcb053d-873c-4046-87e4-bbd75566901d",
                "wertgarantieProductId": "2",
                "wertgarantieProductName": "Basis",
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
    persist: () => undefined
};


function generateIds(ids) {
    return () => ids.pop();
}

test("checkout call executed without confirmation", async () => {
    const wertgarantieShoppingCart = {
        clientId: "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
        orders: [
            {
                wertgarantieProduct: {
                    id: "2"
                },
                shopProduct: {
                    price: "1000",
                    deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                    model: "Super Bike"
                },
                id: "18ff0413-bcfd-48f8-b003-04b57762067a"
            }
        ]
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
        expect(e).toBeInstanceOf(ClientError);
    }
});

