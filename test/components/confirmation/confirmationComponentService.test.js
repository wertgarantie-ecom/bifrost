const service = require('../../../src/components/confirmation/confirmationComponentService');
const productOffersTestResponse = require('../../productoffer/productOffersTestResponses').productOffers;

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
    orders: [
        {
            orderId: "18ff0413-bcfd-48f8-b003-04b57762067a",
            shopProduct: {
                model: "Super Bike",
                price: 100000,
                deviceClass: "Bike"
            },
            wertgarantieProduct: {
                id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                name: "Komplettschutz",
                paymentInterval: "monthly"
            }
        },
        {
            orderId: "28ff0413-bcfd-48f8-b003-04b57762067a",
            shopProduct: {
                model: "Super Bike",
                price: 100000,
                deviceClass: "Bike"
            },
            wertgarantieProduct: {
                id: "bb91b2de-cbb9-49e8-a3a5-1b6e8296403d",
                name: "Komplettschutz",
                paymentInterval: "monthly"
            }
        }
    ],
    confirmations: {
        legalAgeConfirmed: true,
        termsAndConditionsConfirmed: true
    }
};

const expectedResponse = {
    shoppingCart: {
        "publicClientId": "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
        "signature": "signature",
        "orders": [
            {
                "orderId": "18ff0413-bcfd-48f8-b003-04b57762067a",
                "shopProduct": {
                    "model": "Super Bike",
                    "deviceClass": "Bike",
                    "price": 100000
                },
                "wertgarantieProduct": {
                    "id": "9338a770-0d0d-4203-8d54-583a03bdebf3",
                    "name": "Komplettschutz",
                    "paymentInterval": "monthly"
                }
            },
            {
                "orderId": "18ff0413-bcfd-48f8-b003-04b57762067a",
                "shopProduct": {
                    "model": "Super Bike",
                    "deviceClass": "Bike",
                    "price": 100000
                },
                "wertgarantieProduct": {
                    "id": "bb91b2de-cbb9-49e8-a3a5-1b6e8296403d",
                    "name": "Komplettschutz",
                    "paymentInterval": "monthly"
                }
            }
        ],
        "confirmations": {
            "legalAgeConfirmed": true,
            "termsAndConditionsConfirmed": true
        }
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
