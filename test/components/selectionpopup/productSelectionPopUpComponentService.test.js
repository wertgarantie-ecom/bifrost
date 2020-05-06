const service = require('../../../src/components/selectionpopup/productSelectionPopUpComponentService');
const productOffersTestResponses = require("../../productoffer/productOffersTestResponses");

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
    const componentTextsJson = {
        title: "Vergessen Sie nicht Ihren Rundumschutz",
        subtitle: "Wählen Sie die Versicherung aus, die Ihnen zusagt",
        footerHtml: "Versicherung ist Vertrauenssache, deshalb setzt %s neben <strong>500.000 zufriedener Kunden</strong> auf die <strong>Wertgarantie</strong>, den <strong>Testsieger in Sachen Sicherheit</strong>",
        partnerShop: "Testshop",
        detailsHeader: "Details",
        termsAndConditions: "Allgemeine Versicherungsbedingungen",
        wertgarantieFurtherInfo: "Mehr zur Wertgarantie",
        showDetailsText: "Details anzeigen",
        hideDetailsText: "Details ausblenden",
        cancelButtonText: "Nein, danke",
        confirmButtonText: "Versicherung hinzufügen"

    };
    const mockComponentTextsService = {
        getComponentTextsForClientAndLocal: () => componentTextsJson
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
        texts: {
            title: "Vergessen Sie nicht Ihren Rundumschutz",
            subtitle: "Wählen Sie die Versicherung aus, die Ihnen zusagt",
            footerHtml: "Versicherung ist Vertrauenssache, deshalb setzt Testshop neben <strong>500.000 zufriedener Kunden</strong> auf die <strong>Wertgarantie</strong>, den <strong>Testsieger in Sachen Sicherheit</strong>",
            partnerShop: "Testshop",
            detailsHeader: "Details",
            termsAndConditions: "Allgemeine Versicherungsbedingungen",
            wertgarantieFurtherInfo: "Mehr zur Wertgarantie",
            showDetailsText: "Details anzeigen",
            hideDetailsText: "Details ausblenden",
            cancelButtonText: "Nein, danke",
            confirmButtonText: "Versicherung hinzufügen"
        },
        products: [{
            advantages: ["Volle Kostenübernahme bei Reparaturen", "Bei Totalschaden zählt der Zeitwert", "Für private und berufliche Nutzung", "Weltweiter Schutz", "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte", "Unsachgemäße Handhabung"],
            IPIDText: "Informationsblatt für Versicherungsprodukte",
            IPIDUri: "http://localhost:3000/documents/justnotthere",
            excludedAdvantages: ["Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten", "Diebstahlschutz", "Keine Selbstbeteiligung im Schadensfall", "einfacher Diebstahl"],
            id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
            imageLink: "imageLink1",
            GTCIText: "Allgemeine Versicherungsbedingungen",
            GTCIUri: "http://localhost:3000/documents/justnotthere",
            name: "Komplettschutz",
            paymentInterval: "monatl.",
            priceFormatted: "ab 8,00 €",
            taxFormatted: "(inkl. 1,28 € VerSt**)",
            top3: ["Für private und berufliche Nutzung", "Unsachgemäße Handhabung", "Weltweiter Schutz"]
        }, {
            advantages: ["einfacher Diebstahl", "Für private und berufliche Nutzung", "Unsachgemäße Handhabung", "Weltweiter Schutz", "Volle Kostenübernahme bei Reparaturen", "Bei Totalschaden zählt der Zeitwert", "Für private und berufliche Nutzung", "Weltweiter Schutz", "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte", "Unsachgemäße Handhabung"],
            IPIDText: "Informationsblatt für Versicherungsprodukte",
            IPIDUri: "http://localhost:3000/documents/justnotthere",
            excludedAdvantages: [],
            id: "bb91b2de-cbb9-49e8-a3a5-1b6e8296403d",
            imageLink: "imageLink2",
            GTCIText: "Allgemeine Versicherungsbedingungen",
            GTCIUri: "http://localhost:3000/documents/justnotthere",
            name: "Komplettschutz mit Premium-Option",
            paymentInterval: "monatl.",
            priceFormatted: "ab 9,95 €",
            taxFormatted: "(inkl. 1,59 € VerSt**)",
            top3: ["Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten", "Diebstahlschutz", "Keine Selbstbeteiligung im Schadensfall"]
        }],

    };
    expect(result.valid).toEqual(true);
    expect(result.instance).toEqual(expectedResult);
});