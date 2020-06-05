const clientService = require('../clientconfig/clientService');
const handbookService = require('./handbookService');

exports.getClientHandbook = async function getClientHandbook(req, res, next) {
    const client = await clientService.findClientById(req.params.clientId);
    if (!client) {
        return res.sendStatus(204);
    }

    const handbook = handbookService.generateHandbookForClient(client);
    if (!handbook) {
        return res.status(204).send('no handbook configuration found for given client');
    }

    return res.status(200).send(handbook);
};