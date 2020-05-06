const _repository = require('./clientComponentTextRepository');
const components = require('../components/components').components;
const clientService = require('./clientService');
const validate = require('../framework/validation/validator').validate;
const defaultTexts = require('./defaultComponentTexts').defaultComponentTexts;
const _ = require('lodash');

function mergeComponentTextsWithDefault(componentTexts, componentName, locale) {
    return _.merge(defaultTexts[componentName][locale], componentTexts);
}

exports.saveNewComponentTextsForClientId = async function saveNewComponentTexts(clientId, locale, componentName, componentTexts, repository = _repository) {
    if (!(clientId && componentName && componentTexts && components[componentName])) {
        const errorDetails = {
            clientId: clientId,
            componentName: componentName,
            componentTexts: componentTexts,
            mappedComponentName: components[componentName] || `could not map ${componentName} to one of the component enums`
        };
        throw new Error(`Could not save new texts for ${componentName} component. Details: ${JSON.stringify(errorDetails)}`);
    }
    componentTexts = mergeComponentTextsWithDefault(componentTexts, componentName, locale);
    const client = await clientService.findClientById(clientId);
    validate(componentTexts, components[componentName].textsSchema);
    return repository.persist(componentTexts, client.id, locale, componentName)
};

exports.getComponentTextsForClientAndLocal = async function getComponentTextsForClientAndLocal(clientId, componentName, locale = 'de', repository = _repository) {
    return repository.findByClientIdAndLocaleAndComponent(clientId, locale, componentName);
};

exports.getAllComponentTextsForClient = async function getAllComponentTextsForClient(clientId, repository = _repository) {
    return repository.findAllByClientId(clientId);
};

exports.addDefaultTextsForAllComponents = async function addDefaultTextsForAllComponents(clientId, partnerShopName, locale = "de", repository = _repository) {
    return Promise.all(Object.keys(components).map(async componentKey => {
        await this.saveNewComponentTextsForClientId(clientId, locale, componentKey, {partnerShop: partnerShopName}, repository);
    }));
};