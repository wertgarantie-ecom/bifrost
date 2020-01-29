const repository = require('../repositories/ClientRepository');
const uuid = require('uuid');

exports.findClientForSecret = async function findClientForSecret(secret) {
    const client = await repository.findClientForSecret(secret);
    if (!client) {
        throw new InvalidClientIdError(`Could not find Client for specified secret.`)
    }
    return client;
};

exports.findClientForPublicClientId = async function findClientForPublicClientId(publicClientId) {
    const client = await repository.findClientForPublicClientId(publicClientId);
    if (!client) {
        throw new InvalidClientIdError(`Could not find Client for specified public client ID: ${publicClientId}`);
    }
    return client;
};

exports.deleteClientById = async function deleteClientById(clientId) { // technical clientId
    const isDeleted = await repository.deleteClientById(clientId);
    if (!isDeleted) {
        throw new InvalidClientIdError(`Could not delete client with technical id ${clientId}`);
    }
    return isDeleted
}

exports.findAllClients = async function findAllClients() {
    return await repository.findAllClients();
}

exports.addNewClient = async function addNewClient(requestBody) {
    const clientData = {
        id: uuid(),
        name: requestBody.name,
        secrets: requestBody.secrets,
        publicClientIds: requestBody.publicClientIds
    }
    const newClient = await repository.persistClientSettings(clientData);
    return newClient;
}

class InvalidClientIdError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}