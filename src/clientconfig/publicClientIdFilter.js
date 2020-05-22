const clientService = require('../clientconfig/clientService');

module.exports = async function setClientByPublicId(req, res, next) {
    const publicClientId = req.params.publicClientId;
    if (!publicClientId) {
        return next();
    }
    req.clientConfig = await clientService.findClientForPublicClientId(publicClientId);
    return next();
};