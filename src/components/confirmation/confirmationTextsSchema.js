exports.confirmationTextsSchema = {
    type: "object",
    required: [
        "title",
        "subtitle",
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
        confirmationPrompt: {
            type: "string"
        }
    }
}