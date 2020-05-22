const clientService = require('../clientconfig/clientService');

module.exports = async function setClientByPublicId(req, res, next) {
    const publicClientId = req.params.publicClientId;
    req.clientConfig = await clientService.findClientForPublicClientId(publicClientId);
    return next();
};