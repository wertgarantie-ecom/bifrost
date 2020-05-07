exports.confirmationTextsSchema = {
    type: "object",
    additionalProperties: false,
    required: [
        "title",
        "subtitle",
        "confirmationTextTermsAndConditions",
        "confirmationPrompt"
    ],
    properties: {
        title: {
            type: "string"
        },
        subtitle: {
            type: "string"
        },
        confirmationTextTermsAndConditions: {
            type: "string"
        },
        confirmationPrompt: {
            type: "string"
        }
    }
}