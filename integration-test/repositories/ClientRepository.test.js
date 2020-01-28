const clientRepository = require('../../src/repositories/ClientRepository');
const uuid = require('uuid');

describe("should find persisted client properties by given secret", () => {

    const clientData = {
        id: uuid(),
        name: "bikeShop",
        secrets: [uuid() + "", uuid() + ""],
        publicClientIds: [uuid() + "", uuid() + ""]
    };

    test("should persist valid client data", async () => {
        await clientRepository.persistClientSettings(clientData);
    });

    test("should find persisted client data by given secret", async () => {
        const client = await clientRepository.findClientForSecret(clientData.secrets[0]);
        expect(client).toEqual(clientData);
    })
});

describe("should find persisted client properties by given public client id", () => {

    const clientData = {
        id: uuid(),
        name: "bikeShop",
        secrets: [uuid() + ""],
        publicClientIds: [uuid() + ""]
    };

    test("should persist valid client data", async () => {
        await clientRepository.persistClientSettings(clientData);
    });

    test("should find persisted client data by given secret", async () => {
        const client = await clientRepository.findClientForPublicClientId(clientData.publicClientIds[0]);
        expect(client).toEqual(clientData);
    })
});