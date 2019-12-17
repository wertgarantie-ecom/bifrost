const addProductToShoppingCartWithOrderId = require('../../src/services/shoppingCartService').addProductToShoppingCartWithOrderId;
const shoppingCartService = require('../../src/services/shoppingCartService');
const ValidationError = require('joi').ValidationError;
const uuid = require('uuid');
const axios = require('axios');

function validProduct() {
    return {
        productId: 1234,
        deviceClass: "0dc47b8a-f984-11e9-adcf-afabcc521093",
        devicePrice: 12.0,
        deviceCurrency: "EUR",
        shopProductName: "Phone X",
        orderId: "9fd47b8a-f984-11e9-adcf-afabcc521083"
    }
}

test("should create and fill new shopping cart if no cart is given", () => {
    expect(addProductToShoppingCartWithOrderId(undefined, validProduct(), "430fc03e-f99c-11e9-a13b-83c858d3a184", "9fd47b8a-f984-11e9-adcf-afabcc521083").products).toEqual([validProduct()]);
});

test("new created shopping cart should have given clientId", () => {
    const clientId = uuid();
    expect(addProductToShoppingCartWithOrderId(undefined, validProduct(), clientId, "9fd47b8a-f984-11e9-adcf-afabcc521083").clientId).toEqual(clientId);
});

test("should add product to existing shopping cart", () => {
    const includedProduct = {
        productId: 4543545,
        deviceClass: "0dc47b8a-f984-11e9-adcf-afabcc521093",
        devicePrice: 12.0,
        deviceCurrency: "EUR",
        shopProductName: "Phone X",
        orderId: "5f507954-fed1-45c9-aaa6-30f216d6f163"
    };
    const validShoppingCart = {
        clientId: "430fc03e-f99c-11e9-a13b-83c858d3a184",
        products: [includedProduct]
    };
    expect(addProductToShoppingCartWithOrderId(validShoppingCart, validProduct(), "430fc03e-f99c-11e9-a13b-83c858d3a184", "9fd47b8a-f984-11e9-adcf-afabcc521083").products).toEqual([includedProduct, validProduct()]);
});

test("should validate if given cart has proper structure", () => {
    let invalidCart = {};

    expect(() => {
        addProductToShoppingCartWithOrderId(invalidCart, validProduct()).products
    }).toThrow(ValidationError);
});

test("should validate if given product has proper structure", () => {
    let invalidProduct = {
        productId: "1234",
        deviceClass: "0dc47b8a-f984-11e9-adcf-afabcc521093",
        deviceCurrency: "EUR",
    };
    expect(() => {
        addProductToShoppingCartWithOrderId(undefined, invalidProduct).products
    }).toThrow(ValidationError);
});

test("should validate if product was given", () => {
    expect(() => {
        addProductToShoppingCartWithOrderId(undefined, undefined).products
    }).toThrow(ValidationError);
});


test("should reject product with different clientId", () => {
    const productWithDifferentClientId = {
        productId: 1234,
        deviceClass: "0dc47b8a-f984-11e9-adcf-afabcc521093",
        devicePrice: 12.0,
        deviceCurrency: "EUR",
        shopProductName: "Phone X"
    };

    const shoppingCart = {
        clientId: "b8a0169e-f99e-11e9-9611-67317e9f4f28",
        products: []
    };

    expect(() => {
        addProductToShoppingCartWithOrderId(shoppingCart, productWithDifferentClientId).products
    }).toThrow(ValidationError);
});

test("should allow duplicate products", () => {
    let clientId = uuid();
    const validShoppingCart = {
        clientId: clientId,
        products: [validProduct()]
    };
    expect(addProductToShoppingCartWithOrderId(validShoppingCart, validProduct(), clientId, "9fd47b8a-f984-11e9-adcf-afabcc521083").products).toEqual([validProduct(), validProduct()]);
});

test("should confirm valid shopping cart", () => {
    let clientId = uuid();
    const validShoppingCart = {
        clientId: clientId,
        products: [validProduct()],
        confirmed: false
    };
    const confirmedShoppingCart = shoppingCartService.confirmShoppingCart(validShoppingCart, clientId);

    expect(confirmedShoppingCart.confirmed).toEqual(true);
});

test("should check validity of shopping cart on confirmation", () => {
    let clientId = uuid();
    const invalidShoppingCart = {
        clientId: clientId,
        products: [validProduct()],
        confirmed: 12
    };
    expect(() => shoppingCartService.confirmShoppingCart(invalidShoppingCart, clientId)).toThrow(ValidationError);
});

test("should unconfirm valid shopping cart", () => {
    let clientId = uuid();
    const validShoppingCart = {
        clientId: clientId,
        products: [validProduct()],
        confirmed: false
    };
    const confirmedShoppingCart = shoppingCartService.unconfirmShoppingCart(validShoppingCart, clientId);

    expect(confirmedShoppingCart.confirmed).toEqual(false);
});

test("should check validity of shopping cart on removing confirmation", () => {
    let clientId = uuid();
    const invalidShoppingCart = {
        clientId: clientId,
        products: [validProduct()],
        confirmed: 12
    };
    expect(() => shoppingCartService.unconfirmShoppingCart(invalidShoppingCart, clientId)).toThrow(ValidationError);
});

test("should throw error if undefined shopping cart is given to confirmation", () => {
    expect(() => shoppingCartService.unconfirmShoppingCart(undefined, uuid())).toThrow(ValidationError);
});

test("should throw error if null shopping cart is given to confirmation", () => {
    expect(() => shoppingCartService.unconfirmShoppingCart(null, uuid())).toThrow(ValidationError);
});


test("added product should always reject confirmation", () => {
    const includedProduct = {
        productId: 4543545,
        deviceClass: "0dc47b8a-f984-11e9-adcf-afabcc521093",
        devicePrice: 12.0,
        deviceCurrency: "EUR",
        shopProductName: "Phone X",
        orderId: "5f507954-fed1-45c9-aaa6-30f216d6f163"
    };
    const validShoppingCart = {
        clientId: "430fc03e-f99c-11e9-a13b-83c858d3a184",
        products: [includedProduct]
    };
    expect(addProductToShoppingCartWithOrderId(validShoppingCart, validProduct(), "430fc03e-f99c-11e9-a13b-83c858d3a184", "9fd47b8a-f984-11e9-adcf-afabcc521083").confirmed).toEqual(false);
});

test("shopping cart checkout should checkout wertgarantie product if referenced shop product was also purchased", async () => {
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
        confirmed: true
    };

    const shopShoppingCart = {
        purchasedProducts: [
            {
                price: "1000",
                manufacturer: "Apple Inc",
                deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                model: "IPhone X",
                productId: "1"
            }
        ],
        customer: validCustomer(),
        secretClientId: "myShopSecretClientId"
    };

    const mockClient = jest.fn(() => {
        return {
            'body': '{' +
                '"payload": {' +
                '"contract_number": "28850277",' +
                '"transaction_number": "28850279",' +
                '"message": "Der Versicherungsantrag wurde erfolgreich übermittelt."' +
                '}' +
                '}'
        }
    });
    const result = shoppingCartService.checkoutShoppingCart(shopShoppingCart, wertgarantieShoppingCart, mockClient, new Date(2019, 5, 1, 8, 34, 34, 345));

    expect(mockClient.mock.calls[0][0].data).toEqual({
        productId: "2",
        customer_company: 'INNOQ',
        customer_salutation: 'Herr',
        customer_firstname: 'Max',
        customer_lastname: 'Mustermann',
        customer_street: 'Unter den Linden',
        customer_zip: '52345',
        customer_city: 'Köln',
        customer_country: 'Deutschland',
        customer_email: 'max.mustermann1234@test.com',
        device_manufacturer: 'Apple Inc',
        device_model: 'IPhone X',
        device_class: '6bdd2d93-45d0-49e1-8a0c-98eb80342222',
        device_purchase_price: 1000,
        device_purchase_date: "2019-06-01",
        device_condition: 1,
        payment_type: 'bank_transfer',
        terms_and_conditions_accepted: true
    });
    const resolvedResult = await Promise.resolve(result);
    await expect(resolvedResult).toEqual({
        "purchases": [
            {
                "wertgarantieProductId": "2",
                "shopProductId": "1",
                "success": true,
                "message": "successfully transmitted insurance proposal",
                "contract_number": "28850277",
                "transaction_number": "28850279",
                "activation_code": undefined
            }
        ]
    });
});

test("on checkout call shop price differs from wertgarantie price", async () => {
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
        confirmed: true
    };

    const shopShoppingCart = {
        purchasedProducts: [
            {
                price: "1200.93",
                manufacturer: "Apple Inc",
                deviceClass: "bb3a615d-e92f-4d24-a4cc-22f8a87fc544",
                model: "IPhone X",
                productId: "1"
            }
        ],
        customer: validCustomer(),
        secretClientId: "myShopSecretClientId"
    };

    const mockClient = jest.fn(() => {
        throw new Error("you should never call me");
    });
    const result = shoppingCartService.checkoutShoppingCart(shopShoppingCart, wertgarantieShoppingCart, mockClient);
    await result.then(data => expect(data).toEqual({
        purchases: [
            {
                wertgarantieProductId: "2",
                shopProductId: "1",
                success: false,
                message: "couldn't find matching product in shop cart"
            }
        ]
    }));
});

test("checkout call to heimdall fails", async () => {
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
        confirmed: true
    };

    const shopShoppingCart = {
        purchasedProducts: [
            {
                price: "1000",
                manufacturer: "Apple Inc",
                deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                model: "IPhone X",
                productId: "1"
            }
        ],
        customer: validCustomer(),
        secretClientId: "myShopSecretClientId"
    };

    const mockClient = jest.fn(() => {
        axios({
            method: 'post',
            url: 'url',
            data: 'data'
        });
    });

    const resultPromise = shoppingCartService.checkoutShoppingCart(shopShoppingCart, wertgarantieShoppingCart, mockClient);
    const result = await Promise.resolve(resultPromise);
    expect(result.purchases.length).toEqual(1);
    expect(result.purchases[0].message).toEqual("Failed to transmit insurance proposal. Call to Heimdall threw an error");
});

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

    const shopShoppingCart = {
        purchasedProducts: [
            {
                price: "1000",
                manufacturer: "Apple Inc",
                deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                model: "IPhone X",
                productId: "1"
            }
        ],
        customer: validCustomer(),
        secretClientId: "myShopSecretClientId"
    };

    const result = await shoppingCartService.checkoutShoppingCart(shopShoppingCart, wertgarantieShoppingCart);
    expect(result.purchases[0].message).toEqual("Insurance proposal was not transmitted. Purchase was not confirmed by the user.");
    expect(result.purchases[0].success).toBe(false);
});

function validCustomer() {
    return {
        company: "INNOQ",
        salutation: "Herr",
        firstname: "Max",
        lastname: "Mustermann",
        street: "Unter den Linden",
        zip: "52345",
        city: "Köln",
        country: "Deutschland",
        email: "max.mustermann1234@test.com"
    }
}
