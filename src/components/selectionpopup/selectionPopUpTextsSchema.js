exports.selectionPopUpTextsSchema = {
    type: "object",
    additionalProperties: false,
    required: [
        "title",
        "subtitle",
        "footerHtml",
        "partnerShop",
        "detailsHeader",
        "furtherInformation",
        "wertgarantieFurtherInfo",
        "showDetailsText",
        "hideDetailsText",
        "cancelButtonText",
        "confirmButtonText"
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
        furtherInformation: {
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
