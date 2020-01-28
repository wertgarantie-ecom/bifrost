const _ = require('lodash');

const clients = [
    {
        name: "bikeShop",
        secrets: ["bikesecret1"],
        publicClientIds: ["5209d6ea-1a6e-11ea-9f8d-778f0ad9137f"]
    },
    {
        name: "handyShop",
        secrets: ["handysecret1"],
        publicClientIds: ["bikeclientId1"]
    }
];

exports.findClientForSecret = function findClientForSecret(secret) {
    const client = _.find(clients, (client) => client.secrets.includes(secret));
    if (!client) {
        throw new InvalidClientIdError(`Could not find Client for specified secret.`)
    }
    return client;
};

exports.findClientForPublicClientId = function findClientForPublicClientId(publicClientId) {
    const client = _.find(clients, (client) => client.publicClientIds.includes(publicClientId));
    if (!client) {
        throw new InvalidClientIdError(`Could not find Client for specified client ID: ${publicClientId}`);
    }
    return client;
};

class InvalidClientIdError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}