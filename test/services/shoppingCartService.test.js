const addProductToShoppingCartWithOrderId = require('../../src/services/shoppingCartService').addProductToShoppingCartWithOrderId;
const ValidationError = require('joi').ValidationError;
const uuid = require('uuid');

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


