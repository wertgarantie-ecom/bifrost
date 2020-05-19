const clientService = require('../clientconfig/clientService');
const documentationService = require('./documentationService');

exports.getClientDocumentation = async function getClientDocumentation(req, res, next) {
    const client = await clientService.findClientById(req.params.clientId);
    if (!client) {
        return res.sendStatus(204);
    }

    const installationInstructions = documentationService.getInstallationInstructions(client);

    return res.status(200).send(installationInstructions);
};