exports.confirmationTextsSchema = {
    type: "object",
    required: [
        "title",
        "subtitle",
        "confirmationTextTermsAndConditions",
        "confirmationPrompt"
    ],
    properties: {
        boxTitle: {
            type: "string"
        },
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