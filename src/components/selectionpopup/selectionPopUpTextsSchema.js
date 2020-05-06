exports.selectionPopUpTextsSchema = {
    type: "object",
    additionalProperties: false,
    required: [
        "title",
        "subtitle",
        "footerHtml",
        "detailsHeader",
        "termsAndConditions",
        "wertgarantieFurtherInfo",
        "showDetailsText",
        "hideDetailsText",
        "cancelButtonText",
        "confirmButtonText",
        "partnerShop"
    ],
    properties: {
        title: {
            type: "stirng"
        },
        subtitle: {
            type: "string"
        },
        shopName: {
            type: "string"
        },
        footerHtml: {
            type: "string"
        },
        detailsHeader: {
            type: "string"
        },
        termsAndConditions: {
            type: "string"
        },
        wertgarantieFurtherInfo: {
            type: "string"
        },
        showDetailsText: {
            type: "string"
        },
        hideDetailsText: {
            type: "string"
        },
        cancelButtonText: {
            type: "string"
        },
        confirmButtonText: {
            type: "string"
        },
        partnerShop: {
            type: "string"
        }
    }
};
