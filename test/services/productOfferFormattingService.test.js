const service = require("../../src/services/productOfferFormattingService");
const documentTypes = require("../../src/services/documentTypes").documentTypes;

test("should extract correct document", () => {
    const productOffer = {
        "documents": [
            {
                "uri": "http://localhost:3000/documents/da39a3ee5e6b4b0d3255bfef95601890afd80709",
                "type": "LN",
                "name": "GU WG DE KS 0419_RECHTSDOKUMENTE.PDF"
            },
            {
                "uri": "http://localhost:3000/documents/abc",
                "type": "IPID",
                "name": "GU WG DE KS 0419_IPID.PDF"
            }
        ]
    };

    const document = service.fromProductOffer(productOffer).getDocument(documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION);

    expect(document.uri).toEqual("http://localhost:3000/documents/abc");
    expect(document.name).toEqual("GU WG DE KS 0419_IPID.PDF");
});


test("should not fail on missing document", () => {
    const productOffer = {
        "documents": [
            {
                "uri": "http://localhost:3000/documents/da39a3ee5e6b4b0d3255bfef95601890afd80709",
                "type": "LN",
                "name": "GU WG DE KS 0419_RECHTSDOKUMENTE.PDF"
            },
            {
                "uri": "http://localhost:3000/documents/abc",
                "type": "IPID",
                "name": "GU WG DE KS 0419_IPID.PDF"
            }
        ]
    };

    const document = service.fromProductOffer(productOffer).getDocument(documentTypes.COMPARISON);

    expect(document.uri).toEqual(undefined);
    expect(document.name).toEqual(undefined);
});


test("should return correct diff array", () => {
    const productOffer = {
        advantages: ["advantage1", "advantage2", "advantage3"]
    };
    const allAdvantages = [
        {
            advantages: ["advantage1", "advantage2", "advantage3"],
        },
        {
            advantages: ["advantage1", "advantage2", "advantage3", "advantage4", "service", "special_advantage"],
        }
    ];


    const advantagesDiff = service.fromProductOffer(productOffer).getAdvantageCategories(allAdvantages).excludedAdvantages;

    expect(advantagesDiff).toContain("special_advantage", "service", "advantage4");
    expect(advantagesDiff).not.toContain("advantage1", "advantage2", "advantage3");
});
