const signObject = require("../../src/services/signatureService").signObject;
const verifyObject = require("../../src/services/signatureService").verifyObject;
const signShoppingCart = require("../../src/services/signatureService").signShoppingCart;
const verifyShoppingCart = require("../../src/services/signatureService").verifyShoppingCart;

test("should ignore whitespace", () => {
    const originalShoopingCart = {
        clientId: '5209d6ea-1a6e-11ea-9f8d-778f0ad9137f',
        confirmed: true,
        products: [
            {
                wertgarantieProductId: 4,
                shopProductId: "1",
                deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                devicePrice: "1000",
                shopProductName: "Super Bike",
                orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
            },
            {
                wertgarantieProductId: 1,
                shopProductId: "1",
                deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                devicePrice: "1000",
                shopProductName: "Super Bike",
                orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
            }
        ],
    };

    const hackedShoppingCart = {
        confirmed: true,
        clientId: '5209d6ea-1a6e-11ea-9f8d-778f0ad9137f',
        products: [
            {
                wertgarantieProductId: 4,
                shopProductId: "1",
                deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                devicePrice: "1000",
                shopProductName: "Super Bike",
                orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
            },
            {
                wertgarantieProductId: 1,
                shopProductId: "1",
                deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                devicePrice: "1000",
                shopProductName: "Super Bike",
                orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
            }
        ],
    };

    const originalSignature = signObject(originalShoopingCart, "secret");
    const hackedSignature = signObject(hackedShoppingCart, "secret");

    expect(originalSignature).toBe("66VkdfvMGWIw7Fuvc60neb1UznM9ZAA6n+abYba0Rvk=");
    expect(originalSignature).not.toBe(hackedSignature);
});

test("should use given secret to compute signature", () => {

    const shoppingCart = {
        clientId: '5209d6ea-1a6e-11ea-9f8d-778f0ad9137f',
        confirmed: true,
        products: [
            {
                wertgarantieProductId: 4,
                shopProductId: "1",
                deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                devicePrice: "1000",
                shopProductName: "Super Bike",
                orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
            },
            {
                wertgarantieProductId: 1,
                shopProductId: "1",
                deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                devicePrice: "1000",
                shopProductName: "Super Bike",
                orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
            }
        ],
    };

    const signatureWithSecret1 = signObject(shoppingCart, "secret1");
    const signatureWithSecret2 = signObject(shoppingCart, "secret2");

    expect(signatureWithSecret1).not.toBe(signatureWithSecret2);
});


test("verifies valid signed shopping cart", () => {
    const shoppingCart = {
        clientId: '5209d6ea-1a6e-11ea-9f8d-778f0ad9137f',
        confirmed: true,
        products: [
            {
                wertgarantieProductId: 4,
                shopProductId: "1",
                deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                devicePrice: "1000",
                shopProductName: "Super Bike",
                orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
            },
            {
                wertgarantieProductId: 1,
                shopProductId: "1",
                deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                devicePrice: "1000",
                shopProductName: "Super Bike",
                orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
            }
        ],
    };

    const result = verifyObject(shoppingCart, "66VkdfvMGWIw7Fuvc60neb1UznM9ZAA6n+abYba0Rvk=", "secret");
    expect(result).toBe(true);
});

test("verify shoppingCart", () => {
    const shoppingCart = {
        clientId: '5209d6ea-1a6e-11ea-9f8d-778f0ad9137f',
        confirmed: true,
        products: [
            {
                wertgarantieProductId: 4,
                shopProductId: "1",
                deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                devicePrice: "1000",
                shopProductName: "Super Bike",
                orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
            },
            {
                wertgarantieProductId: 1,
                shopProductId: "1",
                deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                devicePrice: "1000",
                shopProductName: "Super Bike",
                orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
            }
        ],
    };

    const signedShoppingCart = signShoppingCart(shoppingCart, "secret");

    const result = verifyShoppingCart(signedShoppingCart, "secret");

    expect(result).toBe(true);
});