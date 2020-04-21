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
            detailsDocText: "Produktinformationsblatt",
            detailsDocUri: "http://localhost:3000/documents/justnotthere",
            excludedAdvantages: ["Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten", "Diebstahlschutz", "Keine Selbstbeteiligung im Schadensfall", "einfacher Diebstahl"],
            id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
            imageLink: "imageLink1",
            infoSheetText: "Rechtsdokumente",
            infoSheetUri: "http://localhost:3000/documents/da39a3ee5e6b4b0d3255bfef95601890afd80709",
            name: "Komplettschutz",
            paymentInterval: "monatl.",
            priceFormatted: "ab 8,00 €",
            taxFormatted: "(inkl. 1,28 € VerSt**)",
            top3: ["Für private und berufliche Nutzung", "Unsachgemäße Handhabung", "Weltweiter Schutz"]
        }, {
            advantages: ["einfacher Diebstahl", "Für private und berufliche Nutzung", "Unsachgemäße Handhabung", "Weltweiter Schutz", "Volle Kostenübernahme bei Reparaturen", "Bei Totalschaden zählt der Zeitwert", "Für private und berufliche Nutzung", "Weltweiter Schutz", "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte", "Unsachgemäße Handhabung"],
            detailsDocText: "Produktinformationsblatt",
            detailsDocUri: "http://localhost:3000/documents/justnotthere",
            excludedAdvantages: [],
            id: "bb91b2de-cbb9-49e8-a3a5-1b6e8296403d",
            imageLink: "imageLink2",
            infoSheetText: "Rechtsdokumente",
            infoSheetUri: "http://localhost:3000/documents/da39a3ee5e6b4b0d3255bfef95601890afd80709",
            name: "Komplettschutz mit Premium-Option",
            paymentInterval: "monatl.",
            priceFormatted: "ab 9,95 €",
            taxFormatted: "(inkl. 1,59 € VerSt**)",
            top3: ["Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten", "Diebstahlschutz", "Keine Selbstbeteiligung im Schadensfall"]
        }]
    };
    expect(result.valid).toEqual(true);
    expect(result.instance).toEqual(expectedResult);
});