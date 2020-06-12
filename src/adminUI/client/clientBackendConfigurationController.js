const clientService = require('../../clientconfig/clientService');
const clientConfigNavbar = require('../htmlTemplates/htmlTemplate').clientConfigurationNavbar;
const htmlTemplate = require('../htmlTemplates/htmlTemplate').htmlTemplate;

exports.showBackendConfig = async function showBackendConfig(req, res) {
    const client = await clientService.findClientById(req.params.clientId);

    const body = `<h2>${client.name}</h2>
        ${clientConfigNavbar("backend-config", client.id)}
    `;

    return res.status(200).send(htmlTemplate(client.name, [], body))
};

exports.saveBackendConfig = async function saveBackendConfig(req, res) {

};