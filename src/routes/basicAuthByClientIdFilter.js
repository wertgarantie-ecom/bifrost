const basicAuth = require('express-basic-auth');
const clientRepository = require('../clientconfig/clientRepository');

async function basicAuthByClientId(req, res, next) {
    const clientConfig = await clientRepository.findClientById(req.params.clientId);
    const options = {
        users: {},
        challenge: true
    };
    options.users[clientConfig.basicAuthUser] = clientConfig.basicAuthPassword;
    return basicAuth(options)(req, res, next);
}

module.exports = basicAuthByClientId;
