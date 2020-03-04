const service = require('../../src/services/confirmationComponentService');
const heimdallTestData = require("./heimdallTestProducts").heimdallTestProducts;

const heimdallClientMock = {
    getProductOffers: async () => heimdallTestData.payload
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
            wertgarantieProductId: 4,
            shopProductId: "1",
            deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
            devicePrice: "1000",
            shopProductName: "Super Bike",
            orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
        },
        {
            wertgarantieProductId: 1,
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
                "wertgarantieProductId": 4,
                "shopProductId": "1",
                "deviceClass": "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
                "devicePrice": "1000",
                "shopProductName": "Super Bike",
                "orderId": "18ff0413-bcfd-48f8-b003-04b57762067a"
            },
            {
                "wertgarantieProductId": 1,
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
            paymentInterval: 'monatl.',
            price: 'ab 6,95 €',
            includedTax: '(inkl. 1,11€ VerSt**)',
            productTitle: 'Premium',
            top3: ["Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten", "Diebstahlschutz", "Keine Selbstbeteiligung im Schadensfall"],
            productInformationSheetUri: 'https://stage-api.wertgarantie.com/download/0fd3b43b-164c-45ea-8e2f-9b6f35c57c81',
            productInformationSheetText: "Produktinformationsblatt",
            productBackgroundImageLink: 'imageLink',
            shopProductShortName: 'Super Bike',
            orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
        },
        {
            paymentInterval: 'monatl.',
            price: 'ab 5,00 €',
            includedTax: '(inkl. 0,80€ VerSt**)',
            productTitle: 'Basis',
            top3: ["Für private und berufliche Nutzung", "Unsachgemäße Handhabung", "Weltweiter Schutz"],
            productInformationSheetUri: 'https://stage-api.wertgarantie.com/download/b190b136-5d4f-43a0-b9f2-f1dd23348448',
            productInformationSheetText: "Produktinformationsblatt",
            productBackgroundImageLink: 'imageLink',
            shopProductShortName: 'Super Bike',
            orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
        }
    ],
    generalConfirmationText: 'Ich akzeptiere die Allgemeinen Versicherungsbedingungen <a href="https://stage-api.wertgarantie.com/download/9f1506a9-65e9-467c-a8d0-8f7ccd47d75b">(AVB)</a> und die Bestimmungen zum Datenschutz. \n' +
        '                                    Das gesetzliche Widerrufsrecht, die Produktinformationsblätter und die Vermittler-Erstinformation habe ich \n' +
        '                                    zur Kenntnis genommen und alle Dokumente heruntergeladen. Mit der Bestätigung der Checkbox erkläre ich mich damit \n' +
        '                                    einverstanden, dass mir alle vorstehenden Unterlagen an meine E-Mail-Adresse übermittelt werden. Der Übertragung \n' +
        '                                    meiner Daten an Wertgarantie stimme ich zu. Der Betrag wird separat per Rechnung bezahlt.',
};


test("should return proper confirmation component data for one product", async () => {
    const confirmationData = await service.prepareConfirmationData(
        testShoppingCart,
        heimdallClientMock,
        productImageServiceMock,
        mockClientService(clientData)
    );
    expect(confirmationData).toEqual(expectedResponse);
});

test("should return undefined if no shopping cart is given", async () => {
    const result = await service.prepareConfirmationData(undefined);
    expect(result).toEqual(undefined);
});
