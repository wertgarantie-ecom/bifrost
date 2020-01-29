const clientRepository = require('../../src/repositories/ClientRepository');
const uuid = require('uuid');

describe("should find persisted client properties by given secret", () => {

    const clientData = {
        id: uuid(),
        name: "bikeShop",
        secrets: [uuid() + "", uuid() + ""].sort(),
        publicClientIds: [uuid() + "", uuid() + ""].sort()
    };

    test("should persist valid client data", async () => {
        const persistResult = await clientRepository.persistClientSettings(clientData);
        expect(persistResult).toEqual(clientData);
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

    test("should find persisted client data by given public id", async () => {
        const client = await clientRepository.findClientForPublicClientId(clientData.publicClientIds[0]);
        expect(client).toEqual(clientData);
    })
});

describe("should delete client data for client id", () => {

    const clientData = {
        id: uuid(),
        name: "bikeShop",
        secrets: [uuid() + "", uuid() + ""].sort(),
        publicClientIds: [uuid() + "", uuid() + ""].sort()
    };

    test("should persist valid client data", async () => {
        await clientRepository.persistClientSettings(clientData);
    });

    test("could find persisted data", async () => {
        const client = await clientRepository.findClientById(clientData.id);
        expect(client).toEqual(clientData);
    });

    test("should delete persisted client data by given id", async () => {
        const isDeleted = await clientRepository.deleteClientById(clientData.id);
        expect(isDeleted).toEqual(true);
    });

    test("can not retrieve now deleted data", async () => {
        const client = await clientRepository.findClientById(clientData.id);
        expect(client).toEqual(undefined);
    });
});