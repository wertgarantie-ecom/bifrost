const service = require('../../src/services/confirmationComponentService');
const productOffersTestResponse = require('./productOffersTestResponses').productOffers;

const productOffersMock = {
    getProductOffers: async () => productOffersTestResponse
};

const productImageServiceMock = {
    getRandomImageLinksForDeviceClass: () => ["imageLink"]
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

const testShoppingCart = {
    clientId: "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
    signature: "signature",
    products: [
        {
            wertgarantieProductId: "9338a770-0d0d-4203-8d54-583a03bdebf3",
            shopProductId: "1",
            deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
            devicePrice: "1000",
            shopProductName: "Super Bike",
            orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
        },
        {
            wertgarantieProductId: "bb91b2de-cbb9-49e8-a3a5-1b6e8296403d",
            shopProductId: "1",
            deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
            devicePrice: "1000",
            shopProductName: "Super Bike",
            orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
        }
    ],
    legalAgeConfirmed: true,
    termsAndConditionsConfirmed: true
};

const expectedResponse = {
    shoppingCart: {
        "clientId": "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
        "signature": "signature",
        "products": [
            {
                "wertgarantieProductId": "9338a770-0d0d-4203-8d54-583a03bdebf3",
                "shopProductId": "1",
                "deviceClass": "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                "devicePrice": "1000",
                "shopProductName": "Super Bike",
                "orderId": "18ff0413-bcfd-48f8-b003-04b57762067a"
            },
            {
                "wertgarantieProductId": "bb91b2de-cbb9-49e8-a3a5-1b6e8296403d",
                "shopProductId": "1",
                "deviceClass": "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                "devicePrice": "1000",
                "shopProductName": "Super Bike",
                "orderId": "18ff0413-bcfd-48f8-b003-04b57762067a"
            }
        ],
        "legalAgeConfirmed": true,
        "termsAndConditionsConfirmed": true
    },
    legalAgeConfirmed: true,
    termsAndConditionsConfirmed: true,
    headerTitle: 'Herzlichen Glückwunsch, Du hast den besten Schutz für Deinen Einkauf ausgewählt.',
    legalAgeConfirmationText: "Hiermit bestätige ich, dass ich mindestens 18 Jahre alt bin.",
    pleaseConfirmText: "Bitte bestätige die oben stehenden Bedingungen um fortzufahren.",
    confirmText: 'Bitte bestätige noch kurz:',
    products: [
        {
            paymentInterval: "monatl.",
            price: "ab 8,00 €",
            includedTax: "(inkl. 1,28 € VerSt**)",
            productTitle: 'Komplettschutz',
            top3: ["Für private und berufliche Nutzung", "Unsachgemäße Handhabung", "Weltweiter Schutz"],
            productInformationSheetUri: 'http://localhost:3000/documents/justnotthere',
            productInformationSheetText: "Produktinformationsblatt",
            productBackgroundImageLink: 'imageLink',
            shopProductShortName: 'Super Bike',
            orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
        },
        {
            paymentInterval: "monatl.",
            price: "ab 9,95 €",
            includedTax: "(inkl. 1,59 € VerSt**)",
            productTitle: 'Komplettschutz mit Premium-Option',
            top3: ["Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten", "Diebstahlschutz", "Keine Selbstbeteiligung im Schadensfall"],
            productInformationSheetUri: "http://localhost:3000/documents/justnotthere",
            productInformationSheetText: "Produktinformationsblatt",
            productBackgroundImageLink: 'imageLink',
            shopProductShortName: 'Super Bike',
            orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
        },
    ],
    generalConfirmationText: 'Ich akzeptiere die Allgemeinen Versicherungsbedingungen <a href="http://localhost:3000/documents/da39a3ee5e6b4b0d3255bfef95601890afd80709">(AVB)</a> und die Bestimmungen zum Datenschutz. \n' +
        '                                    Das gesetzliche Widerrufsrecht, die Produktinformationsblätter und die Vermittler-Erstinformation habe ich \n' +
        '                                    zur Kenntnis genommen und alle Dokumente heruntergeladen. Mit der Bestätigung der Checkbox erkläre ich mich damit \n' +
        '                                    einverstanden, dass mir alle vorstehenden Unterlagen an meine E-Mail-Adresse übermittelt werden. Der Übertragung \n' +
        '                                    meiner Daten an Wertgarantie stimme ich zu. Der Betrag wird separat per Rechnung bezahlt.',
};


test("should return proper confirmation component data for one product", async () => {
    const confirmationData = await service.prepareConfirmationData(
        testShoppingCart,
        productOffersMock,
        productImageServiceMock,
        mockClientService(clientData)
    );
    expect(confirmationData).toEqual(expectedResponse);
});

test("should return undefined if no shopping cart is given", async () => {
    const result = await service.prepareConfirmationData(undefined);
    expect(result).toEqual(undefined);
});
