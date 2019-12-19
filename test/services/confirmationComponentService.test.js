const service = require('../../src/services/confirmationComponentService');
const heimdallTestData = require("./heimdallTestProducts").heimdallTestProducts;

const heimdallClientMock = {
    getProductOffers: async () => heimdallTestData
};

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
    confirmed: true
};

const expectedResponse = {
    signedShoppingCart: {
        clientId: '5209d6ea-1a6e-11ea-9f8d-778f0ad9137f',
        confirmed: true,
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
    },
    confirmed: true,
    title: 'Herzlichen Glückwunsch, Du hast den besten Schutz für Deinen Einkauf ausgewählt.',
    confirmatioHeader: 'Bitte bestätige noch kurz:',
    products: [
        {
            paymentInterval: 'monatl.',
            price: 'ab 6,95 €',
            includedTax: '(inkl. 1,11€ VerSt**)',
            productTitle: 'Premium',
            top3: ["Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten", "Diebstahlschutz", "Keine Selbstbeteiligung im Schadensfall"],
            productInformationSheetUri: 'https://stage-api.wertgarantie.com/download/928e51ef-d92f-4aa4-ba42-61d1e100af2f',
            productInformationSheetText: "Produktinformationsblatt",
            productBackgroundImageLink: "https://stage-api.wertgarantie.com/download/0fd3b43b-164c-45ea-8e2f-9b6f35c57c81",
            shopProductShortName: 'Super Bike'
        },
        {
            paymentInterval: 'monatl.',
            price: 'ab 5,00 €',
            includedTax: '(inkl. 0,80€ VerSt**)',
            productTitle: 'Basis',
            top3: ["Für private und berufliche Nutzung", "Unsachgemäße Handhabung", "Weltweiter Schutz"],
            productInformationSheetUri: 'https://stage-api.wertgarantie.com/download/82e38762-4440-46a9-a34e-58974a3ddad5',
            productInformationSheetText: "Produktinformationsblatt",
            productBackgroundImageLink: 'imageLink1',
            shopProductShortName: 'Super Bike'
        }
    ],
    confirmationTextGeneral: 'Ich akzeptiere die Allgemeinen Versicherungsbedingungen <a href=\\"https://stage-api.wertgarantie.com/download/9f1506a9-65e9-467c-a8d0-8f7ccd47d75b\\">(AVB)</a> und die Bestimmungen zum Datenschutz. \n' +
        '                                    Das gesetzliche Widerrufsrecht, die Produktinformationsblätter und die Vermittler-Erstinformation habe ich \n' +
        '                                    zur Kenntnis genommen und alle Dokumente heruntergeladen. Mit der Bestätigung der Checkbox erkläre ich mich damit \n' +
        '                                    einverstanden, dass mir alle vorstehenden Unterlagen an meine E-Mail-Adresse übermittelt werden. Der Übertragung \n' +
        '                                    meiner Daten an Wertgarantie stimme ich zu. Der Betrag wird separat per Rechnung bezahlt.',
};


test("should return proper confirmation component data for one product", async () => {
    const confirmationData = await service.prepareConfirmationData("clientId", testShoppingCart, heimdallClientMock);
    expect(confirmationData).toEqual(expectedResponse);
});
