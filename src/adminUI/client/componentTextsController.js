const componentTextsService = require('../../clientconfig/clientComponentTextService');
const clientService = require('../../clientconfig/clientService');
const htmlTemplate = require('../htmlTemplates/htmlTemplate').htmlTemplate;
const clientConfigNavbar = require('../htmlTemplates/htmlTemplate').clientConfigurationNavbar;
const defaultComponentTexts = require('../../clientconfig/defaultComponentTexts').defaultComponentTexts;

const editorTableHeader = `
    <hr/>
    <div class="component-editing-section">
        <div class="component-editing-section__item--attribute" style="font-size: 1.2em; font-weight: 700;">
            Attribut
        </div>
        <div class="component-editing-section__item" style="font-size: 1.2em; font-weight: 700;">
            Edit
        </div>
        <div class="component-editing-section__item" style="font-size: 1.2em; font-weight: 700;">
            Aktueller Text
        </div>
    </div>
    <hr/>`;

function getInputRow(inputName, componentTexts, excludedAttributes = []) {
    return excludedAttributes.includes(inputName) ? `` :
        `<div class="component-editing-section">
            <div class="component-editing-section__item--attribute">
                "${inputName}"
            </div>
            <div class="component-editing-section__item">
                <textarea name="${inputName}" class="editing-textarea">${Array.isArray(componentTexts[inputName]) ? componentTexts[inputName].join(';;') : componentTexts[inputName]}</textarea>
            </div>
            <div class="component-editing-section__item">
                ${componentTexts[inputName]}
            </div>
        </div>
        <hr/>`
}

function getComponentTextsEditor(component, componentTexts, clientId, selectedLanguage, excludedAttributes = []) {
    // language=HTML
    const currentTexts = componentTexts ? `<form action="${'/admin/' + clientId + '/component-texts'}" method="post">
            <input type="hidden" name="component" value="${component}">
            <input type="hidden" name="language" value="${selectedLanguage}">
            ${editorTableHeader}
            ${Object.keys(componentTexts).map(attribute => getInputRow(attribute, componentTexts, excludedAttributes)).join('')}
            <button type="submit" class="submit-button">Texte für ${component} component speichern</button>
        </form>
        <hr/>` : ``;

    return currentTexts + `
        <form action="${'/admin/' + clientId + '/component-texts/new-attribute'}" method="post">
            <input type="hidden" name="component" value="${component}">
            <input type="hidden" name="language" value="${selectedLanguage}">
            <div class="component-editing-section">
                <div class="component-editing-section__item--attribute">
                    <input type="text" name="newAttribute" placeholder="neues Attribut">
                </div>
                <div class="component-editing-section__item">
                    <textarea name="newAttributeValue" class="editing-textarea" placeholder="Wert des neuen Attributs (Arrays mit ';;' separieren)"></textarea>
                </div>
                <div class="component-editing-section__item">
                    <button type="submit" class="submit-button">neues Attribut speichern</button>
                </div>
            </div>
        </form>
        </hr>
    `
}

function renderComponentTextEditor(componentTexts, component, selectedLanguage, client) {
    let componentName;
    switch (component) {
        case "ratingTexts":
            componentName = "rating";
            return getComponentTextsEditor(componentName, componentTexts, client.id, selectedLanguage);
        case "selectionPopUpTexts":
            componentName = "selectionpopup";
            return getComponentTextsEditor(componentName, componentTexts, client.id, selectedLanguage, ["documents", "productTexts"]);
        case "selectionEmbedded":
            componentName = "selectionembedded";
            return getComponentTextsEditor(componentName, componentTexts, client.id, selectedLanguage, ["documents", "productTexts"]);
        case "confirmationTexts":
            componentName = "confirmation";
            return getComponentTextsEditor(componentName, componentTexts, client.id, selectedLanguage, ["documents", "productTexts"]);
        case "aftersalesTexts":
            componentName = "aftersales";
            return getComponentTextsEditor(componentName, componentTexts.success, client.id, selectedLanguage);
        case "landingPageTexts":
            componentName = "landingpage";
            return getComponentTextsEditor(componentName, componentTexts, client.id, selectedLanguage);
    }
}

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
        <div class="component-section">
            ${Object.keys(selectedLanguageTexts).map(component =>
        `<details class="component-details">
                <summary>${component}</summary>
                ${renderComponentTextEditor(selectedLanguageTexts[component], component, selectedLanguage, client)}
            </details>`).join('')}
        </div>
    `;

    return res.status(200).send(htmlTemplate(client.name + " - Komponenten-Texte", body));
};

exports.saveComponentTexts = async function saveComponentTexts(req, res) {
    const clientId = req.params.clientId;
    const body = req.body;
    let currentTexts;
    let defaultTexts;
    if (body.component === "aftersales") {
        currentTexts = (await componentTextsService.getComponentTextsForClientAndLocal(clientId, body.component, body.language)).success;
        defaultTexts = defaultComponentTexts[body.component][body.language].success;
    } else {
        currentTexts = await componentTextsService.getComponentTextsForClientAndLocal(clientId, body.component, body.language);
        defaultTexts = defaultComponentTexts[body.component][body.language];
    }
    Object.keys(currentTexts).map(key => {
        if (body[key]) {
            currentTexts[key] = body[key].includes(';;') ? body[key].split(';;') : body[key];
        }
        if (!currentTexts[key]) {
            currentTexts[key] = defaultTexts[key]
        }
    });
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