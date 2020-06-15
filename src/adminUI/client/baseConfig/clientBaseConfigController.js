const clientService = require('../../../clientconfig/clientService');
const htmlTemplate = require('../../htmlTemplates/htmlTemplate').htmlTemplate;
const clientConfigNavbar = require('../../htmlTemplates/htmlTemplate').clientConfigurationNavbar;
const baseDataEditor = require('../../htmlTemplates/baseDataEditor');
const baseConfigStyling = require('../../css/baseConfigStyling').css;

exports.showAllClients = async function showAllClients(req, res) {
    const clients = await clientService.findAllClients();
    //language=HTML
    const body = `<h2>Alle Client Configs</h2>
        <div class="client-list">
        ${clients.map(clientConfig => `
            <div class="horizontal">
                <div>
                    <a href="${'/admin/' + clientConfig.id}">${clientConfig.name}</a>
                </div>
                <div>
                    <form action="/admin/delete" method="post">
                        <input type="hidden" value="${clientConfig.id}" name="clientId" />
                        <button type="submit" class="submit-button submit-button--delete">Client löschen</button>
                    </form>
                </div>
            </div>
            <hr/>`).join('')
        }
        </div>
        <form action="/admin" method="post">
            <div class="new-client-form">
                <div class="new-client-input">
                    <div class="input-label">
                        <label for="shopName">
                            Shop Name: 
                        </label>
                    </div>
                    <div class="input-field">
                        <input type="text" name="shopName" id="shopName" />
                    </div>
                </div>
                <div class="new-client-input">
                    <div class="input-label">
                        <label for="email">
                            E-Mail: 
                        </label>
                    </div>
                    <div class="input-field">
                        <input type="email" name="email" id="email" />
                    </div>
                </div>
                <div class="new-client-input">
                    <div class="input-label">
                        <label for="webservicesUsername">
                            Webservices Username:
                        </label>
                    </div>
                    <div class="input-field">
                        <input type="text" name="webservicesUsername" id="webservicesUsername" />
                    </div>
                </div>
                <div class="new-client-input">
                    <div class="input-label">
                        <label for="webservicesPassword">
                            Webservices Passwort: 
                        </label>
                    </div>
                    <div class="input-field">
                        <input type="text" name="webservicesPassword" id="webservicesPassword" />
                    </div>
                </div>
                <div class="new-client-input">
                    <div class="input-label">
                        <label for="activePartnerNumber">
                            Aktivpartnernummer: 
                        </label>
                    </div>
                    <div class="input-field">
                        <input type="text" name="activePartnerNumber" id="activePartnerNumber" />
                    </div>
                </div>
                <div class="new-client-input">
                    <div class="input-label">
                        <label for="type">
                            Typ:
                        </label>
                    </div>
                    <div class="input-field">
                        <select name="type" id="type">
                            <option value="bike" selected>Bike / E-Bike</option>
                            <option value="smartphone">Smartphone</option>
                        </select>
                    </div>
                </div>
                <div class="new-client-input">
                    <button type="submit" class="submit-button">Neuen Client anlegen</button>
                </div>
            </div>
        </form>
`;

    return res.status(200).send(htmlTemplate("Alle Clients", [], body));
};

exports.showClient = async function showClient(req, res) {
    const client = await clientService.findClientById(req.params.clientId);

    const body = `<h2>${client.name}</h2>
        ${clientConfigNavbar("base", client.id)}
        ${baseDataEditor.getEditor(client)}
    `;

    return res.status(200).send(htmlTemplate(client.name, [baseConfigStyling], body))
};

exports.saveBaseClientConfig = async function saveBaseClientConfig(req, res) {
    const clientData = await clientService.findClientById(req.params.clientId);
    const attribute = req.body.attribute;
    const newValue = attribute === 'activePartnerNumber' ? parseInt(req.body.value) : req.body.value;
    clientData[attribute] = newValue;
    await clientService.updateClientData(clientData);
    res.redirect(req.originalUrl);
};

exports.addNewClient = async function addNewClient(req, res) {
    const newClientData = {
        name: req.body.shopName,
        email: req.body.email,
        backends: {
            webservices: {
                username: req.body.webservicesUsername,
                password: req.body.webservicesPassword
            }
        },
        shopName: req.body.activePartnerNumber,
    };
    await clientService.addNewClientFromDefaults(newClientData, req.body.type)
    res.redirect('/admin');
};

exports.deleteClient = async function deleteClient(req, res) {
    await clientService.deleteClientById(req.body.clientId);
    res.redirect('/admin');
};
