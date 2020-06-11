const componentTextsService = require('../../../clientconfig/clientComponentTextService');
const clientService = require('../../../clientconfig/clientService');
const htmlTemplate = require('../../htmlTemplates/htmlTemplate').htmlTemplate;
const clientConfigNavbar = require('../../htmlTemplates/htmlTemplate').clientConfigurationNavbar;
const componentTextEditorTemplate = require('../../htmlTemplates/componentTextEditor');
const componentTextEditorStyling = require('../../css/componentTextEditorStyling').componentTextEditorStyling;

exports.showComponentTexts = async function showComponentTexts(req, res) {
    const client = await clientService.findClientById(req.params.clientId);
    const selectedLanguage = req.query.language || "de";
    const allTexts = await componentTextsService.getAllComponentTextsForClient(client.id);
    const selectedLanguageTexts = allTexts[selectedLanguage];

    const body = `<h2>${client.name + ' - Komponenten-Texte'}</h2>
        ${clientConfigNavbar('component-texts', client.id)}
        <div class="language-menu">
            ${Object.keys(allTexts).map(language =>
        `<div class="language-link${language === selectedLanguage ? ' language-link--selected' : ''}">
                <a href="${'/admin/' + client.id + '/component-texts?language=' + language}">${language}</a>
            </div>`).join('')}
        </div>
        ${componentTextEditorTemplate.get(selectedLanguageTexts, selectedLanguage, client)}
        
    `;

    return res.status(200).send(htmlTemplate(client.name + " - Komponenten-Texte", [componentTextEditorStyling], body));
};

exports.saveComponentText = async function saveComponentText(req, res) {
    const clientId = req.params.clientId;
    const body = req.body;
    let currentTexts;
    if (body.component === "aftersales") {
        currentTexts = (await componentTextsService.getComponentTextsForClientAndLocal(clientId, body.component, body.language)).success;
    } else {
        currentTexts = await componentTextsService.getComponentTextsForClientAndLocal(clientId, body.component, body.language);
    }
    currentTexts[req.body.attribute] = req.body.value;
    if (body.component === "aftersales") {
        await componentTextsService.saveNewComponentTextsForClientId(clientId, body.language, body.component, {success: currentTexts});
    } else {
        await componentTextsService.saveNewComponentTextsForClientId(clientId, body.language, body.component, currentTexts);
    }

    return res.redirect(req.originalUrl);
};

exports.saveNewTextAttribute = async function saveNewTextAttribute(req, res) {
    const clientId = req.params.clientId;
    let currentTexts;
    if (req.body.component === "aftersales") {
        currentTexts = (await componentTextsService.getComponentTextsForClientAndLocal(clientId, req.body.component, req.body.language)).success;
    } else {
        currentTexts = await componentTextsService.getComponentTextsForClientAndLocal(clientId, req.body.component, req.body.language);
    }
    if (!currentTexts) {
        currentTexts = {};
    }
    currentTexts[req.body.newAttribute] = req.body.newAttributeValue.includes(";;") ? req.body.newAttributeValue.split(";;") : req.body.newAttributeValue
    if (req.body.component === "aftersales") {
        await componentTextsService.saveNewComponentTextsForClientId(clientId, req.body.language, req.body.component, {success: currentTexts});
    } else {
        await componentTextsService.saveNewComponentTextsForClientId(clientId, req.body.language, req.body.component, currentTexts);
    }

    return res.redirect(req.originalUrl.replace('/new-attribute', ''));
};

exports.deleteComponentText = async function deleteComponentText(req, res) {
    const clientId = req.params.clientId;
    const body = req.body;
    let currentTexts;
    if (body.component === "aftersales") {
        currentTexts = (await componentTextsService.getComponentTextsForClientAndLocal(clientId, body.component, body.language)).success;
    } else {
        currentTexts = await componentTextsService.getComponentTextsForClientAndLocal(clientId, body.component, body.language);
    }
    delete currentTexts[req.body.attribute];
    if (body.component === "aftersales") {
        await componentTextsService.saveNewComponentTextsForClientId(clientId, body.language, body.component, {success: currentTexts});
    } else {
        await componentTextsService.saveNewComponentTextsForClientId(clientId, body.language, body.component, currentTexts);
    }

    return res.redirect(req.originalUrl.replace('/delete', ''));
};