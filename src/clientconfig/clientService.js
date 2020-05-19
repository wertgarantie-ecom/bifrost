const _repository = require('./clientRepository');
const uuid = require('uuid');
const validate = require('../framework/validation/validator').validate;
const newClientSchema = require('./newClientSchema').newClientSchema;
const _clientComponentTextService = require('./clientComponentTextService');

async function findClientById(id) {
    return await _repository.findClientById(id);
}

exports.findClientById = findClientById;

exports.updateWebservicesBackendConfig = async function updateWebservicesBackendConfig(clientId, newWebservicesConfig) {
    validate(newWebservicesConfig, newClientSchema.properties.backends.properties.webservices);
    const client = await findClientById(clientId);
    if (!client) {
        throw new InvalidClientIdError(`Could not find Client for specified ID: ${clientId}`);
    }
    client.backends.webservices = newWebservicesConfig;
    return await _repository.update(client.id, client.backends);
};

exports.findClientForSecret = async function findClientForSecret(secret) {
    const client = await _repository.findClientForSecret(secret);
    if (!client) {
        throw new InvalidClientIdError(`Could not find Client for specified secret.`)
    }
    return client;
};

exports.findClientForPublicClientId = async function findClientForPublicClientId(publicClientId) {
    const client = await _repository.findClientForPublicClientId(publicClientId);
    if (!client) {
        throw new InvalidClientIdError(`Could not find Client for specified public client ID: ${publicClientId}`);
    }
    return client;
};

exports.deleteClientById = async function deleteClientById(clientId) { // technical clientId
    const isDeleted = await _repository.deleteClientById(clientId);
    if (!isDeleted) {
        throw new InvalidClientIdError(`Could not delete client with technical id ${clientId}`);
    }
    return isDeleted
};

exports.findAllClients = async function findAllClients() {
    return await _repository.findAllClients();
};

exports.addNewClient = async function addNewClient(createClientRequest, repository = _repository, clientComponentTextService = _clientComponentTextService) {
    const clientData = {
        id: createClientRequest.id || uuid(),
        name: createClientRequest.name,
        email: createClientRequest.email,
        backends: createClientRequest.backends,
        activePartnerNumber: createClientRequest.activePartnerNumber,
        secrets: createClientRequest.secrets || ['secret:' + uuid()],
        publicClientIds: createClientRequest.publicClientIds || ['public:' + uuid()],
        credentials: createClientRequest.credentials
    };
    validate(clientData, newClientSchema);
    const persistedClientData = await repository.insert(clientData);
    await clientComponentTextService.addDefaultTextsForAllComponents(clientData.id, clientData.name);
    return persistedClientData;
};


class InvalidClientIdError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}