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
        },
        documents: {
            type: "object",
            properties: {
                "PIS": {
                    type: "string"
                },
                "IPID": {
                    type: "string"
                },
                "GTCI": {
                    type: "string"
                }
            },
            required: [
                "PIS", "IPID", "GTCI"
            ]
        },
        productTexts: {
            type: "object",
            properties: {
                "monthly": {
                    type: "string"
                },
                "quarterly": {
                    type: "string"
                },
                "halfYearly": {
                    type: "string"
                },
                "yearly": {
                    type: "string"
                },
                "taxInformation": {
                    type: "string"
                }
            }
        },
    }
};
