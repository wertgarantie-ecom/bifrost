const _basicAuth = require('express-basic-auth');
const _clientRepository = require('../clientconfig/clientRepository');
const isUUID = require('is-uuid');

async function basicAuthByClientId(req, res, next, clientRepository = _clientRepository, basicAuth = _basicAuth, env = process.env) {
    const clientId = req.params.clientId;
    if (!isUUID.anyNonNil(clientId)) {
        return res.sendStatus(400);
    }
    const options = {
        users: {},
        challenge: true
    };

    const clientConfig = await clientRepository.findClientById(req.params.clientId);
    if (clientConfig && clientConfig.basicAuthUser && clientConfig.basicAuthPassword) {
        options.users[clientConfig.basicAuthUser] = clientConfig.basicAuthPassword;
    }
    options.users[env.BASIC_AUTH_USER] = env.BASIC_AUTH_PASSWORD;
    return basicAuth(options)(req, res, next);
}

module.exports = basicAuthByClientId;
