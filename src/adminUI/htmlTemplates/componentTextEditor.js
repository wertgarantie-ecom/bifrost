function getInputRow(component, selectedLanguage, inputName, componentTexts, clientId, excludedAttributes = []) {
    return excludedAttributes.includes(inputName) ? `` :
        `<div class="attribute">
            ${inputName}
        </div>
        <div class="input__row">
            <form class="input__edit" action="${'/admin/' + clientId + '/component-texts'}" method="post">
                <input type="hidden" name="component" value="${component}">
                <input type="hidden" name="language" value="${selectedLanguage}">
                <input type="hidden" name="attribute" value="${inputName}">
                <div class="edit-row__item--large">
                    <textarea name="value">${Array.isArray(componentTexts[inputName]) ? componentTexts[inputName].join(';;') : componentTexts[inputName]}</textarea>
                </div>
                <div class="edit-row__item--large">
                    ${componentTexts[inputName]}
                </div>
                <div class="edit-row__item--small">
                    <button type="submit" class="submit-button">Speichern</button>
                </div>
            </form>
            <form class="input__delete" action="${'/admin/' + clientId + '/component-texts/delete'}" method="post">
                <input type="hidden" name="attribute" value="${inputName}">
                <input type="hidden" name="component" value="${component}">
                <input type="hidden" name="language" value="${selectedLanguage}">
                <button type="submit" class="submit-button submit-button--delete">Löschen</button>
            </form>
        </div>`;
}

function getComponentTextsEditor(component, componentTexts, clientId, selectedLanguage, excludedAttributes = []) {
    // language=HTML
    const currentTexts = componentTexts ? `
        <div class="editor__row editor__row--header row">
            <div class="row__item--header">Attribute bearbeiten:</div>
        </div>
        <hr/>
        ${Object.keys(componentTexts).map(attribute => getInputRow(component, selectedLanguage, attribute, componentTexts, clientId, excludedAttributes)).join('')}
        <hr/>` : ``;

    return currentTexts + `
        <div class="input-row">
            <form action="${'/admin/' + clientId + '/component-texts/new-attribute'}" method="post">
                <input type="hidden" name="component" value="${component}">
                <input type="hidden" name="language" value="${selectedLanguage}">
                <div class="component-editing-section">
                    <div>
                        <input type="text" name="newAttribute" placeholder="neues Attribut">
                    </div>
                    <div>
                        <textarea name="newAttributeValue" class="editing-textarea" placeholder="Wert des neuen Attributs (Arrays mit ';;' separieren)"></textarea>
                    </div>
                    <div>
                        <button type="submit" class="submit-button">neues Attribut speichern</button>
                    </div>
                </div>
            </form>
        </div>
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
        case "listSelection":
            componentName = "listselection";
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

exports.get = function get(selectedLanguageTexts, selectedLanguage, client) {
    return `
    <div class="component-section">
        ${Object.keys(selectedLanguageTexts).map(component =>
        `<details class="component-details">
            <summary>${component}</summary>
            ${renderComponentTextEditor(selectedLanguageTexts[component], component, selectedLanguage, client)}
        </details>`).join('')}
    </div>`;
};