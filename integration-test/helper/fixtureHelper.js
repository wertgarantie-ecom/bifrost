const clientRepository = require('../../src/repositories/ClientRepository');
const signatureService = require('../../src/services/signatureService');
const uuid = require('uuid');

exports.createDefaultClient = async function createDefaultClient() {
    const id = uuid();
    const clientData = {
        id: id,
        name: "testclient",
        secrets: [uuid() + ""],
        publicClientIds: [uuid() + ""]
    };

    await clientRepository.persistClientSettings(clientData);
    const createdClient = await clientRepository.findClientById(id);
    if (!createdClient) {
        throw new Error("test helper could not create client");
    }
    return createdClient;
};

exports.createSignedShoppingCart = function createSignedShoppingCart(data = {}) {
    const {clientId = uuid(), deviceClass = "fbfb2d44-4ff8-4579-9cc0-0a3ccb8d6f2d", devicePrice = 139999, shopProductId = "1", wertgarantieProductId = 1} = data;
    const sessionId = uuid();
    const shoppingCart =
        {
            "sessionId": sessionId,
            "clientId": clientId,
            "products": [
                {
                    "wertgarantieProductId": wertgarantieProductId,
                    "shopProductId": shopProductId,
                    "deviceClass": deviceClass,
                    "devicePrice": devicePrice,
                    "deviceCurrency": "EUR",
                    "shopProductName": "E-Mountainbike Premium 3000",
                    "orderId": "e0accedd-b087-46df-899e-91229eb43747"
                }
            ],
            "confirmed": false
        };

    return signatureService.signShoppingCart(shoppingCart);
};