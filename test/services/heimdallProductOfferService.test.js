const service = require("../../src/services/heimdallProductOfferService");
const documentType = require("../../src/services/heimdallProductOfferService").documentType;

test("should extract correct document", () => {
    const heimdallProductOffer = {
        documents: [
            {
                "document_title": "Rechtsdokumente",
                "document_file": "gu_wg_de_ks_0419_rechtsdokumente.pdf",
                "document_type": null,
                "document_link": "https://stage-api.wertgarantie.com/download/82e38762-4440-46a9-a34e-58974a3ddad5"
            },
            {
                "document_title": "Informationsblatt für Versicherungsprodukte",
                "document_file": "ipid.pdf",
                "document_type": "IPID",
                "document_link": "https://stage-api.wertgarantie.com/download/1eb7d0ce-6c62-4264-a3e7-58319bd4d4d1"
            },
            {
                "document_title": "Versicherungsschein",
                "document_file": "policy.pdf",
                "document_type": "POLICY",
                "document_link": "https://stage-api.wertgarantie.com/download/e725f5d0-a72c-4d00-9063-81753f191150"
            },
            {
                "document_title": "DSGVO Beileger",
                "document_file": "gdpr.pdf",
                "document_type": "GDPR",
                "document_link": "https://stage-api.wertgarantie.com/download/334e5b9b-0fb5-4a45-859e-ad0267a4431e"
            }]
    };

    const document = service.fromProductOffer(heimdallProductOffer).getDocument(documentType.INSURANCE_CERTIFICATE);

    expect(document.uri).toEqual("https://stage-api.wertgarantie.com/download/e725f5d0-a72c-4d00-9063-81753f191150");
    expect(document.title).toEqual("Versicherungsschein");
});


test("should not fail on missing document", () => {
    const heimdallProductOffer = {
        documents: [
            {
                "document_title": "Rechtsdokumente",
                "document_file": "gu_wg_de_ks_0419_rechtsdokumente.pdf",
                "document_type": null,
                "document_link": "https://stage-api.wertgarantie.com/download/82e38762-4440-46a9-a34e-58974a3ddad5"
            },
            {
                "document_title": "Informationsblatt für Versicherungsprodukte",
                "document_file": "ipid.pdf",
                "document_type": "IPID",
                "document_link": "https://stage-api.wertgarantie.com/download/1eb7d0ce-6c62-4264-a3e7-58319bd4d4d1"
            },
            {
                "document_title": "Versicherungsschein",
                "document_file": "policy.pdf",
                "document_type": "POLICY",
                "document_link": "https://stage-api.wertgarantie.com/download/e725f5d0-a72c-4d00-9063-81753f191150"
            },
            {
                "document_title": "DSGVO Beileger",
                "document_file": "gdpr.pdf",
                "document_type": "GDPR",
                "document_link": "https://stage-api.wertgarantie.com/download/334e5b9b-0fb5-4a45-859e-ad0267a4431e"
            }]
    };

    const document = service.fromProductOffer(heimdallProductOffer).getDocument(documentType.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE);

    expect(document.uri).toEqual(undefined);
    expect(document.title).toEqual(undefined);
});


test("should return correct diff array", () => {
    const productOffer = {
        special_advantages: [],
        services: [],
        advantages: ["advantage1, advantage2, advantage3"]
    };
    const allAdvantages = [
        {
            special_advantages: [],
            services: [],
            advantages: ["advantage1, advantage2, advantage3"],
        },
        {
            special_advantages: ["special_advantage"],
            services: ["service"],
            advantages: ["advantage1, advantage2, advantage3", "advantage4"],
        }
    ];


    const advantagesDiff = service.fromProductOffer(productOffer).getAdvantageCategories(allAdvantages).excludedAdvantages;

    expect(advantagesDiff).toContain("special_advantage", "service", "advantage4");
    expect(advantagesDiff).not.toContain("advantage1, advantage2, advantage3");
});
