const _repository = require('./ClientRepository');
const uuid = require('uuid');
const validate = require('../framework/validation/validator').validate;
const newClientSchema = require('./newClientSchema').newClientSchema;

async function findClientById(id) {
    const client = await _repository.findClientById(id);
    if (!client) {
        throw new InvalidClientIdError(`Could not find Client for specified ID: ${id}`);
    }
    return client;
}

exports.findClientById = findClientById;

exports.updateWebservicesBackendConfig = async function updateWebservicesBackendConfig(clientId, newWebservicesConfig) {
    validate(newWebservicesConfig, newClientSchema.properties.backends.properties.webservices);
    const client = await findClientById(clientId);
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

exports.addNewClient = async function addNewClient(createClientRequest, repository = _repository) {
    const clientData = {
        id: uuid(),
        name: createClientRequest.name,
        backends: createClientRequest.backends,
        activePartnerNumber: createClientRequest.activePartnerNumber,
        secrets: createClientRequest.secrets || ['secret:' + uuid()],
        publicClientIds: createClientRequest.publicClientIds || ['public:' + uuid()]
    };
    validate(clientData, newClientSchema);
    return await repository.insert(clientData);
};


class InvalidClientIdError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}