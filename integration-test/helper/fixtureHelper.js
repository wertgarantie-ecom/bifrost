const clientRepository = require('../../src/repositories/ClientRepository');
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