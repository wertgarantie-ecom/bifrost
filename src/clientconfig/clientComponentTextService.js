const _repository = require('./clientComponentTextRepository');
const components = require('../components/components').components;
const clientService = require('./clientService');
const validate = require('../framework/validation/validator').validate;
const Globalize = require('../framework/globalize').Globalize;

exports.saveNewComponentTextsForClientId = async function saveNewComponentTexts(clientId, componentName, componentTexts, repository = _repository) {
    if (!(clientId && componentName && componentTexts && components[componentName])) {
        const errorDetails = {
            clientId: clientId,
            componentName: componentName,
            componentTexts: componentTexts,
            mappedComponentName: components[componentName] || `could not map ${componentName} to one of the component enums`
        };
        throw new Error(`Could not save new texts for ${componentName} component. Details: ${JSON.stringify(errorDetails)}`);
    }
    const client = await clientService.findClientById(clientId);
    validate(componentTexts, components[componentName].textsSchema);
    return repository.persist(componentTexts, client.id, componentName)
};

exports.getComponentTexts = async function getComponentTexts(clientId, componentName, locale = 'de', repository = _repository) {
    const componentTextsJson = await repository.findByClientIdAndComponent(clientId, componentName);
    Globalize.getInstance(locale).loadMessages(componentTextsJson);
}
