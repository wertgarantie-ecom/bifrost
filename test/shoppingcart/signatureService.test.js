const signObject = require("../../src/framework/signatureService").signObject;
const verifyObject = require("../../src/framework/signatureService").verifyObject;
const signShoppingCart = require("../../src/framework/signatureService").signShoppingCart;
const verifyShoppingCart = require("../../src/framework/signatureService").verifyShoppingCart;
const verifyString = require("../../src/framework/signatureService").verifyString;
const verifySessionId = require("../../src/framework/signatureService").verifySessionId;

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

    expect(originalSignature).toBe("eba56475fbcc196230ec5baf73ad2779bd54ce733d64003a9fe69b61b6b446f9");
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

    const result = verifyObject(shoppingCart, "eba56475fbcc196230ec5baf73ad2779bd54ce733d64003a9fe69b61b6b446f9", "secret");
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

test("verify string encryption", () => {
    const encryptedSessionId = 'a3660d23ea7e02859d86302aba8f5cc9cf4b95960ba8fa9909232ba5c28d65d9';
    const secret = "start";
    const sessionId = "helloworld";
    const result = verifyString(encryptedSessionId, sessionId, secret);
    expect(result).toBe(true);
});

test('should verify encrypted session id', () => {
    const clientData = {
        id: "43234",
        name: "testclient",
        secrets: ["invalid", "start", "invalid", "invalid"],
        publicClientIds: ["publicClientId"]
    };
    const result = verifySessionId('a3660d23ea7e02859d86302aba8f5cc9cf4b95960ba8fa9909232ba5c28d65d9', clientData, "helloworld");

    expect(result).toBe(true);
});

test('could not verify encrypted session id with invalid secret', () => {
    const clientData = {
        id: "43234",
        name: "testclient",
        secrets: ["invalid", "alsoinvalid", "invalid", "invalid"],
        publicClientIds: ["publicClientId"]
    };
    const result = verifySessionId('a3660d23ea7e02859d86302aba8f5cc9cf4b95960ba8fa9909232ba5c28d65d9', clientData, "helloworld");

    expect(result).toBe(false);
});
