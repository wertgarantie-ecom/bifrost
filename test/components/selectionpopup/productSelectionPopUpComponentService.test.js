const service = require('../../../src/components/selectionpopup/productSelectionPopUpComponentService');
const productOffersTestResponses = require("../../productoffer/productOffersTestResponses");
const selectionPopUpDefaultTexts = require('../../../src/clientconfig/defaultComponentTexts').defaultComponentTexts.selectionpopup.de;

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
    const mockProductOfferService = {
        getProductOffers: () => productOffersTestResponses.productOffers
    };
    const mockComponentTextsService = {
        getComponentTextsForClientAndLocal: () => selectionPopUpDefaultTexts
    };
    const result = await service.prepareProductSelectionData("Smartphone",
        "devicePrice",
        "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
        undefined,
        mockProductOfferService,
        productImagesServiceMock,
        mockClientService(clientData),
        mockComponentTextsService);
    const expectedResult = {
        texts: selectionPopUpDefaultTexts,
        products: [{
            id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
            name: "Komplettschutz",
            paymentInterval: "monatl.",
            priceFormatted: "8,00 €",
            taxFormatted: "(inkl. 1,28 € VerSt**)",
            top3: [
                {
                    "text": "Für private und berufliche Nutzung",
                    "included": true
                },
                {
                    "text": "Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten",
                    "included": false
                },
                {
                    "text": "Diebstahlschutz",
                    "included": false
                }
            ],
            advantages: [
                {
                    "text": "Keine Selbstbeteiligung im Schadensfall",
                    "included": false
                },
                {
                    "text": "Unsachgemäße Handhabung",
                    "included": true
                },
                {
                    "text": "Weltweiter Schutz",
                    "included": true
                },
                {
                    "text": "Volle Kostenübernahme bei Reparaturen",
                    "included": true
                },
                {
                    "text": "Bei Totalschaden zählt der Zeitwert",
                    "included": true
                },
                {
                    "text": "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte",
                    "included": true
                }
            ],
            IPIDText: "Informationsblatt für Versicherungsprodukte",
            IPIDUri: "http://localhost:3000/documents/justnotthere",
            imageLink: "imageLink1",
            GTCIText: "Allgemeine Versicherungsbedingungen",
            GTCIUri: "http://localhost:3000/documents/justnotthere"
        },
        {
            id: "bb91b2de-cbb9-49e8-a3a5-1b6e8296403d",
            name: "Komplettschutz mit Premium-Option",
            paymentInterval: "monatl.",
            priceFormatted: "9,95 €",
            taxFormatted: "(inkl. 1,59 € VerSt**)",
            top3: [
                {
                    "text": "Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten",
                    "included": true
                },
                {
                    "text": "Diebstahlschutz",
                    "included": true
                },
                {
                    "text": "Keine Selbstbeteiligung im Schadensfall",
                    "included": true
                }
            ],
            advantages: [
                {
                    "text": "Für private und berufliche Nutzung",
                    "included": true
                },
                {
                    "text": "Unsachgemäße Handhabung",
                    "included": true
                },
                {
                    "text": "Weltweiter Schutz",
                    "included": true
                },
                {
                    "text": "Volle Kostenübernahme bei Reparaturen",
                    "included": true
                },
                {
                    "text": "Bei Totalschaden zählt der Zeitwert",
                    "included": true
                },
                {
                    "text": "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte",
                    "included": true
                }
            ],
            IPIDText: "Informationsblatt für Versicherungsprodukte",
            IPIDUri: "http://localhost:3000/documents/justnotthere",
            imageLink: "imageLink2",
            GTCIText: "Allgemeine Versicherungsbedingungen",
            GTCIUri: "http://localhost:3000/documents/justnotthere"
        }],

    };
    expect(result.valid).toEqual(true);
    expect(result.instance).toEqual(expectedResult);
});