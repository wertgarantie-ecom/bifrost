const _repository = require('./clientComponentTextRepository');
const components = require('../components/components').components;
const clientService = require('./clientService');
const jsonschemaValidator = require('jsonschema');

exports.saveNewComponentTextsForClientId = async function saveNewComponetTexts(clientId, componentName, componentTexts, repository = _repository) {
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
    const validationResult = jsonschemaValidator.validate(componentTexts, components[componentName].textsSchema);
    if (!validationResult.valid) {
        const error = new Error();
        error.name = "ValidationError";
        error.errors = validationResult.errors;
        error.instance = validationResult.instance;
        error.message = JSON.stringify(validationResult.errors, null, 2);
        throw error;
    }
    return repository.persist(componentTexts, client.id, componentName)
};