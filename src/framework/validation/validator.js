const jsonschema = require('jsonschema');

function validate(object, schema) {
    const validationResult = jsonschema.validate(object, schema);
    if (!validationResult.valid) {
        const error = new Error();
        error.name = "ValidationError";
        error.errors = validationResult.errors;
        error.instance = validationResult.instance;
        error.message = JSON.stringify(validationResult.errors, null, 2);
        throw error;
    }
    return validationResult
}


exports.validate = validate;