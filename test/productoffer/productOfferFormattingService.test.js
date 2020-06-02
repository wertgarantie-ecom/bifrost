const service = require("../../src/productoffers/productOfferFormattingService");
const documentTypes = require("../../src/documents/documentTypes").documentTypes;
const defaultComponentTexts = require('../../src/clientconfig/defaultComponentTexts').defaultComponentTexts.selectionpopup.de;

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

    const document = service.fromProductOffer(productOffer, defaultComponentTexts).getDocument(documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION);

    expect(document.uri).toEqual("http://localhost:3000/documents/abc");
    expect(document.name).toEqual("Informationsblatt für Versicherungsprodukte");
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

    const document = service.fromProductOffer(productOffer).getDocument(documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE);

    expect(document).toEqual(undefined);
});


test("should return correct diff array", () => {
    const productOffer = {
        advantages: ["advantage1", "advantage2", "advantage3"]
    };
    const allProductOffers = [
        {
            advantages: ["advantage1", "advantage2", "advantage3"],
        },
        {
            advantages: ["advantage1", "advantage2", "advantage3", "advantage4", "service", "special_advantage"],
        }
    ];


    const advantagesDiff = service.fromProductOffer(productOffer).getAdvantageCategories(allProductOffers);

    expect(advantagesDiff.top3).toEqual([
        {
            text: "advantage1",
            included: true
        },
        {
            text: "advantage4",
            included: false
        },
        {
            text: "service",
            included: false
        }
    ]);
    expect(advantagesDiff.advantages).toEqual([
        {
            text: "special_advantage",
            included: false
        },
        {
            text: "advantage2",
            included: true
        },
        {
            text: "advantage3",
            included: true
        }
    ]);
});
