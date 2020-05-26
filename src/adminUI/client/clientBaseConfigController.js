const clientService = require('../../clientconfig/clientService');
const htmlTemplate = require('../htmlTemplates/htmlTemplate').htmlTemplate;
const clientConfigNavbar = require('../htmlTemplates/htmlTemplate').clientConfigurationNavbar;

exports.showAllClients = async function showAllClients(req, res) {
    const clients = await clientService.findAllClients();
    //language=HTML
    const body = `<h2>Alle Client Configs</h2>
        ${clients.map(clientConfig => `<a href="${'/admin/' + clientConfig.id}">${clientConfig.name}</a><hr/>`).join('')}`;

    return res.status(200).send(htmlTemplate("Alle Clients", body));
};

exports.showClient = async function showClient(req, res) {
    const client = await clientService.findClientById(req.params.clientId);

    const body = `<h2>${client.name}</h2>
        ${clientConfigNavbar("base", client.id)}
    `;

    return res.status(200).send(htmlTemplate(client.name, body))
};
