const basicAuth = require('express-basic-auth');
const clientRepository = require('../clientconfig/clientRepository');
const isUUID = require('is-uuid');

async function basicAuthByClientId(req, res, next) {
    const clientId = req.params.clientId;
    if (!isUUID.anyNonNil(clientId)) {
        return res.sendStatus(400);
    }
    const clientConfig = await clientRepository.findClientById(req.params.clientId);
    if (!(clientConfig && clientConfig.basicAuthUser && clientConfig.basicAuthPassword)) {
        return res.sendStatus(204);
    }
    const options = {
        users: {},
        challenge: true
    };
    options.users[clientConfig.basicAuthUser] = clientConfig.basicAuthPassword;
    return basicAuth(options)(req, res, next);
}

module.exports = basicAuthByClientId;
