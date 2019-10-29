const addProductToShoppingCart = require('../../src/services/shoppingCartService').addProductToShoppingCart;
const ValidationError = require('Joi').ValidationError;
const uuid = require('uuid');

function validProduct() {
    return {
        productId: 1234,
        deviceClass: "0dc47b8a-f984-11e9-adcf-afabcc521093",
        devicePrice: 12.0,
        deviceCurrency: "EUR"
    }
}

test("should create and fill new shopping cart if no cart is given", () => {
    expect(addProductToShoppingCart(undefined, validProduct(), "430fc03e-f99c-11e9-a13b-83c858d3a184").products).toEqual([validProduct()]);
});

test("new created shopping cart should have given clientId", () => {
    const clientId = uuid();
    expect(addProductToShoppingCart(undefined, validProduct(), clientId).clientId).toEqual(clientId);
});

test("should add product to existing shopping cart", () => {
    const includedProduct = {
        productId: 4543545,
        deviceClass: "0dc47b8a-f984-11e9-adcf-afabcc521093",
        devicePrice: 12.0,
        deviceCurrency: "EUR",
    };
    const validShoppingCart = {
        clientId: "430fc03e-f99c-11e9-a13b-83c858d3a184",
        products: [includedProduct]
    };
    expect(addProductToShoppingCart(validShoppingCart, validProduct(), "430fc03e-f99c-11e9-a13b-83c858d3a184").products).toEqual([includedProduct, validProduct()]);
});

test("should validate if given cart has proper structure", () => {
    let invalidCart = {};

    expect(() => {
        addProductToShoppingCart(invalidCart, validProduct()).products
    }).toThrow(ValidationError);
});

test("should validate if given product has proper structure", () => {
    let invalidProduct = {
        productId: "1234",
        deviceClass: "0dc47b8a-f984-11e9-adcf-afabcc521093",
        deviceCurrency: "EUR",
    };
    expect(() => {
        addProductToShoppingCart(undefined, invalidProduct).products
    }).toThrow(ValidationError);
});

test("should validate if product was given", () => {
    expect(() => {
        addProductToShoppingCart(undefined, undefined).products
    }).toThrow(ValidationError);
});


test("should reject product with different clientId", () => {
    const productWithDifferentClientId = {
        productId: 1234,
        deviceClass: "0dc47b8a-f984-11e9-adcf-afabcc521093",
        devicePrice: 12.0,
        deviceCurrency: "EUR"
    };

    const shoppingCart = {
        clientId: "b8a0169e-f99e-11e9-9611-67317e9f4f28",
        products: []
    };

    expect(() => {
        addProductToShoppingCart(shoppingCart, productWithDifferentClientId).products
    }).toThrow(ValidationError);
});

test("should allow duplicate products", () => {
    let clientId = uuid();
    const validShoppingCart = {
        clientId: clientId,
        products: [validProduct()]
    };
    expect(addProductToShoppingCart(validShoppingCart, validProduct(), clientId).products).toEqual([validProduct(), validProduct()]);
});


