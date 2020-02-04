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

exports.createSignedShoppingCart = function createSignedShoppingCart(clientId) {
    const sessionId = uuid();
    const shoppingCart =
    {
        "sessionId": sessionId,
        "clientId": clientId || "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
        "products": [
        {
            "wertgarantieProductId": 10,
            "shopProductId": "1",
            "deviceClass": "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
            "devicePrice": 139999,
            "deviceCurrency": "EUR",
            "shopProductName": "E-Mountainbike Premium 3000",
            "orderId": "e0accedd-b087-46df-899e-91229eb43747"
        }
    ],
        "confirmed": false
    }

    return signatureService.signShoppingCart(shoppingCart);
}