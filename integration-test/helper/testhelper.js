const clientRepository = require('../../src/repositories/ClientRepository');
const uuid = require('uuid');

exports.createDefaultClient = async function createDefaultClient() {
    const clientData = {
        id: uuid(),
        name: "testclient",
        secrets: [uuid() + ""],
        publicClientIds: [uuid() + ""]
    }

    clientRepository.persistClientSettings(clientData);

    return clientData;
}