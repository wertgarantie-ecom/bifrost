const service = require('../../src/services/productSelectionPopUpComponentService');
const productOffersTestResponses = require("./productOffersTestResponses");
const heimdallResponses = require("./heimdallTestProducts");

const productImagesServiceMock = {
    getRandomImageLinksForDeviceClass: () => ["imageLink1", "imageLink2"]
};

const clientData =
    {
        name: "bikeShop",
        secrets: ["bikesecret1"],
        publicClientIds: ["5209d6ea-1a6e-11ea-9f8d-778f0ad9137f"]
    };

function mockClientService(clientData) {
    return {
        findClientForPublicClientId: jest.fn(() => clientData)
    }
}

test("should return proper product response", async () => {
    process.env.BACKEND = "heimdall";
    const mockProductOfferService = {
        getProductOffers: () => productOffersTestResponses.productOffers
    };
    const result = await service.prepareProductSelectionData("1dfd4549-9bdc-4285-9047-e5088272dade",
        "devicePrice",
        "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
        mockProductOfferService,
        productImagesServiceMock,
        mockClientService(clientData));
    const expectedResult = {
        title: "Vergessen Sie nicht Ihren Rundumschutz",
        products: [{
            advantages: ["Volle Kostenübernahme bei Reparaturen", "Bei Totalschaden zählt der Zeitwert", "Für private und berufliche Nutzung", "Weltweiter Schutz", "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte", "Unsachgemäße Handhabung"],
            detailsDocText: "Informationsblatt für Versicherungsprodukte",
            detailsDocUri: "https://heimdall-stg-04.wertgarantie.com/download/1eb7d0ce-6c62-4264-a3e7-58319bd4d4d1",
            excludedAdvantages: ["Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten", "Diebstahlschutz", "Keine Selbstbeteiligung im Schadensfall", "einfacher Diebstahl"],
            id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
            imageLink: "imageLink1",
            infoSheetText: "Rechtsdokumente",
            infoSheetUri: "https://heimdall-stg-04.wertgarantie.com/download/82e38762-4440-46a9-a34e-58974a3ddad5",
            name: "Komplettschutz",
            priceFormatted: "ab 5,00 € monatl.",
            taxFormatted: "(inkl. 0,80 € VerSt**)",
            top3: ["Für private und berufliche Nutzung", "Unsachgemäße Handhabung", "Weltweiter Schutz"]
        }, {
            advantages: ["einfacher Diebstahl", "Für private und berufliche Nutzung", "Unsachgemäße Handhabung", "Weltweiter Schutz", "Volle Kostenübernahme bei Reparaturen", "Bei Totalschaden zählt der Zeitwert", "Für private und berufliche Nutzung", "Weltweiter Schutz", "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte", "Unsachgemäße Handhabung"],
            detailsDocText: "Informationsblatt für Versicherungsprodukte",
            detailsDocUri: "https://heimdall-stg-04.wertgarantie.com/download/191a36e2-6685-4a3d-beb0-dc0159a90387",
            excludedAdvantages: [],
            id: "bb91b2de-cbb9-49e8-a3a5-1b6e8296403d",
            imageLink: "imageLink2",
            infoSheetText: "Rechtsdokumente",
            infoSheetUri: "https://heimdall-stg-04.wertgarantie.com/download/928e51ef-d92f-4aa4-ba42-61d1e100af2f",
            name: "Komplettschutz mit Premium-Option",
            priceFormatted: "ab 6,95 € monatl.",
            taxFormatted: "(inkl. 1,11 € VerSt**)",
            top3: ["Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten", "Diebstahlschutz", "Keine Selbstbeteiligung im Schadensfall"]
        }]
    };
    expect(result.valid).toEqual(true);
    expect(result.instance).toEqual(expectedResult);
});

test("return undefined if response is not completely filled", async () => {

    const productOffersService = {
        getProductOffers: () => Promise.resolve(productOffersTestResponses.productOffersWithoutDocuments)
    };
    const result = await service.prepareProductSelectionData("1dfd4549-9bdc-4285-9047-e5088272dade",
        "devicePrice",
        "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
        productOffersService,
        productImagesServiceMock,
        mockClientService(clientData)
    );
    expect(result.valid).toBe(false);
});
