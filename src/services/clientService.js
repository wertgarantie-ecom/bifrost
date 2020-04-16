const _repository = require('../repositories/ClientRepository');
const uuid = require('uuid');
const jsonschema = require('jsonschema');
const newClientSchema = require('../schemas/newClientSchema').newClientSchema;

exports.findClientById = async function findClientById(id) {
    const client = await _repository.findClientById(id);
    if (!client) {
        throw new InvalidClientIdError(`Could not find Client for specified ID: ${id}`);
    }
    return client;
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
        heimdallClientId: createClientRequest.heimdallClientId,
        webservices: createClientRequest.webservices,
        activePartnerNumber: createClientRequest.activePartnerNumber,
        secrets: createClientRequest.secrets || ['secret:' + uuid()],
        publicClientIds: createClientRequest.publicClientIds || ['public:' + uuid()],
        productOffersConfigurations: createClientRequest.productOffersConfigurations
    };
    jsonschema.validate(clientData, newClientSchema, {throwError: true});
    return await repository.persistClientSettings(clientData);
};

class InvalidClientIdError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}