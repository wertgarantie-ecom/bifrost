const selectionEmbeddedService = require('../../../src/components/selectionembedded/selectionEmbeddedService');
const productOffersTestResponses = require("../../productoffer/productOffersTestResponses");
const selectionEmbeddedDefaultComponentTexts = require('../../../src/clientconfig/defaultComponentTexts').defaultComponentTexts.selectionembedded.de;

const clientData = {
    name: "phoneShop",
    secrets: ["phoneSecret1"],
    publicClientIds: ["public:5209d6ea-1a6e-11ea-9f8d-778f0ad9137f"]
};

const productImagesServiceMock = {
    getRandomImageLinksForDeviceClass: () => ["imageLink1", "imageLink2"]
};

const mockProductOfferService = {
    getProductOffers: () => productOffersTestResponses.productOffersPhone
};

const mockComponentTextsService = {
    getComponentTextsForClientAndLocal: () => selectionEmbeddedDefaultComponentTexts
};

test("should prepare correct product offers", async () => {
    const result = await selectionEmbeddedService.prepareProductSelectionData("Smartphone", 90000, clientData, "de", undefined, mockProductOfferService, productImagesServiceMock, mockComponentTextsService);
    expect(result.texts.footerHtml).toEqual("Versicherung ist Vertrauenssache, deshalb setzt Testshop neben <strong>500.000 zufriedener Kunden</strong> auf die <strong>Wertgarantie</strong>, den <strong>Testsieger in Sachen Sicherheit</strong>");
    expect(result.products.length).toEqual(2);
    expect(result.products[0]).toEqual({
        "paymentInterval": "monatl.",
        "intervalCode": "monthly",
        "id": "9338a770-0d0d-4203-8d54-583a03bdebf3",
        "name": "Komplettschutz",
        "shortName": "Basisschutz",
        "top3": [
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
        "advantages": [
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
        "GTCIText": "Allgemeine Versicherungsbedingungen",
        "GTCIUri": "http://localhost:3000/documents/justnotthere",
        "IPIDText": "Informationsblatt für Versicherungsprodukte",
        "IPIDUri": "http://localhost:3000/documents/justnotthere",
        "priceFormatted": "8,00 €",
        "price": 800,
        "taxFormatted": "(inkl. 1,28 € VerSt**)",
        "imageLink": "imageLink1"
    });
    expect(result.products[1]).toEqual({
        "paymentInterval": "monatl.",
        "intervalCode": "monthly",
        "id": "bb91b2de-cbb9-49e8-a3a5-1b6e8296403d",
        "name": "Komplettschutz mit Premium-Option",
        "shortName": "Premiumschutz",
        "top3": [
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
        "advantages": [
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
        "GTCIText": "Allgemeine Versicherungsbedingungen",
        "GTCIUri": "http://localhost:3000/documents/justnotthere",
        "IPIDText": "Informationsblatt für Versicherungsprodukte",
        "IPIDUri": "http://localhost:3000/documents/justnotthere",
        "priceFormatted": "9,95 €",
        "price": 995,
        "taxFormatted": "(inkl. 1,59 € VerSt**)",
        "imageLink": "imageLink2"
    });
});