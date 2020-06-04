const service = require('../../../src/components/confirmation/confirmationComponentService');
const productOffersTestResponse = require('../../productoffer/productOffersTestResponses').productOffersPhone;
const defaultConfirmationTextsDE = require('../../../src/clientconfig/defaultComponentTexts').defaultComponentTexts.confirmation.de;
const _ = require('lodash');

const productOffersMock = {
    getProductOffers: async () => _.cloneDeep(productOffersTestResponse)
};

const productImageServiceMock = {
    getRandomImageLinksForDeviceClass: () => ["imageLink"]
};

const shoppingCartServiceMock = {
    syncShoppingCart: (wertgarantieShoppingCart) => {
        return {
            shoppingCart: wertgarantieShoppingCart,
            changes: {
                updated: [],
                deleted: []
            }
        }
    }
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
    publicClientId: "public:5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
    sessionId: "38ff8413-dcfd-57f8-c013-08b5s762067a",
    orders: [
        {
            id: "18ff0413-bcfd-48f8-b003-04b57762067a",
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
            id: "28ff0413-bcfd-48f8-b003-04b57762067a",
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
        termsAndConditionsConfirmed: true
    }
};

const expectedResponse = {
    shoppingCart: testShoppingCart,
    confirmations: {
        termsAndConditionsConfirmed: true,
        confirmationTextTermsAndConditions: "Ich akzeptiere die Allgemeinen Versicherungsbedingungen <a target=\"_blank\" href=\"http://localhost:3000/documents/justnotthere\">(AVB)</a> und die Bestimmungen zum <a target=\"_blank\" href=\"http://localhost:3000/documents/justnotthere\">Datenschutz</a>. Das gesetzliche <a target=\"_blank\" href=\"http://localhost:3000/documents/justnotthere\">Widerrufsrecht</a> und das Produktinformationsblatt <a target=\"_blank\" href=\"http://localhost:3000/documents/justnotthere\">(IPID)</a> habe ich zur Kenntnis genommen und alle Dokumente heruntergeladen. Mit der Bestätigung der Checkbox erkläre ich mich damit einverstanden, dass mir alle vorstehenden Unterlagen an meine E-Mail-Adresse übermittelt werden. Der Übertragung der erforderlichen Daten zur Übermittlung meines Versicherungsantrages an die WERTGARANTIE AG per E-Mail stimme ich zu. Der Betrag wird separat per Rechnung bezahlt.",
        furtherConfirmations: []
    },
    showPriceChangedWarning: false,
    texts: {
        boxTitle: "Versicherung",
        title: 'Glückwunsch! Dieser Einkauf wird bestens abgesichert',
        subtitle: 'Bitte bestätige noch kurz:',
        priceChangedWarning: "Der Preis deiner Versicherung hat sich geändert!",
        confirmationPrompt: "Bitte bestätige die oben stehenden Bedingungen um fortzufahren."
    },
    orders: [
        {
            paymentInterval: "monatl.",
            price: "8,00 €",
            includedTax: "(inkl. 1,28 € VerSt**)",
            productTitle: 'Komplettschutz',
            top3: ["Für private und berufliche Nutzung", "Unsachgemäße Handhabung", "Weltweiter Schutz"],
            IPIDUri: 'http://localhost:3000/documents/justnotthere',
            IPIDText: "Informationsblatt für Versicherungsprodukte",
            productBackgroundImageLink: 'imageLink',
            shopProductShortName: 'Super Bike',
            updated: false,
            orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
        },
        {
            paymentInterval: "monatl.",
            price: "9,95 €",
            includedTax: "(inkl. 1,59 € VerSt**)",
            productTitle: 'Komplettschutz mit Premium-Option',
            top3: ["Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten", "Diebstahlschutz", "Keine Selbstbeteiligung im Schadensfall"],
            IPIDUri: "http://localhost:3000/documents/justnotthere",
            IPIDText: "Informationsblatt für Versicherungsprodukte",
            productBackgroundImageLink: 'imageLink',
            shopProductShortName: 'Super Bike',
            updated: false,
            orderId: "28ff0413-bcfd-48f8-b003-04b57762067a"
        },
    ],
};

const updatedShoppingCartExpectedResponse = {
    shoppingCart: testShoppingCart,
    confirmations: {
        termsAndConditionsConfirmed: false,
        confirmationTextTermsAndConditions: "Ich akzeptiere die Allgemeinen Versicherungsbedingungen <a target=\"_blank\" href=\"http://localhost:3000/documents/justnotthere\">(AVB)</a> und die Bestimmungen zum <a target=\"_blank\" href=\"http://localhost:3000/documents/justnotthere\">Datenschutz</a>. Das gesetzliche <a target=\"_blank\" href=\"http://localhost:3000/documents/justnotthere\">Widerrufsrecht</a> und das Produktinformationsblatt <a target=\"_blank\" href=\"http://localhost:3000/documents/justnotthere\">(IPID)</a> habe ich zur Kenntnis genommen und alle Dokumente heruntergeladen. Mit der Bestätigung der Checkbox erkläre ich mich damit einverstanden, dass mir alle vorstehenden Unterlagen an meine E-Mail-Adresse übermittelt werden. Der Übertragung der erforderlichen Daten zur Übermittlung meines Versicherungsantrages an die WERTGARANTIE AG per E-Mail stimme ich zu. Der Betrag wird separat per Rechnung bezahlt.",
        furtherConfirmations: []
    },
    showPriceChangedWarning: true,
    texts: {
        boxTitle: "Versicherung",
        title: 'Glückwunsch! Dieser Einkauf wird bestens abgesichert',
        subtitle: 'Bitte bestätige noch kurz:',
        priceChangedWarning: "Der Preis deiner Versicherung hat sich geändert!",
        confirmationPrompt: "Bitte bestätige die oben stehenden Bedingungen um fortzufahren.",
    },
    orders: [
        {
            paymentInterval: "monatl.",
            price: "8,00 €",
            includedTax: "(inkl. 1,28 € VerSt**)",
            productTitle: 'Komplettschutz',
            top3: ["Für private und berufliche Nutzung", "Unsachgemäße Handhabung", "Weltweiter Schutz"],
            IPIDUri: 'http://localhost:3000/documents/justnotthere',
            IPIDText: "Informationsblatt für Versicherungsprodukte",
            productBackgroundImageLink: 'imageLink',
            shopProductShortName: 'Super Bike',
            updated: true,
            orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
        },
        {
            paymentInterval: "monatl.",
            price: "9,95 €",
            includedTax: "(inkl. 1,59 € VerSt**)",
            productTitle: 'Komplettschutz mit Premium-Option',
            top3: ["Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten", "Diebstahlschutz", "Keine Selbstbeteiligung im Schadensfall"],
            IPIDUri: "http://localhost:3000/documents/justnotthere",
            IPIDText: "Informationsblatt für Versicherungsprodukte",
            productBackgroundImageLink: 'imageLink',
            shopProductShortName: 'Super Bike',
            updated: true,
            orderId: "28ff0413-bcfd-48f8-b003-04b57762067a"
        },
    ],
};


test("should return proper confirmation component data for one product", async () => {
    const clientComponentTextService = {
        getComponentTextsForClientAndLocal: () => defaultConfirmationTextsDE
    };


    const confirmationData = await service.prepareConfirmationData(testShoppingCart, clientData, undefined, undefined, productOffersMock, productImageServiceMock, clientComponentTextService, shoppingCartServiceMock);
    expect(confirmationData.instance).toEqual(expectedResponse);
});

test('should return proper confirmation data for not updated ordered', async () => {
    const order = testShoppingCart.orders[0];
    const listOfUpdatedIds = ["anything"];
    const orderData = await service.getConfirmationProductData(order, clientData, "de", productOffersMock, productImageServiceMock, defaultConfirmationTextsDE, listOfUpdatedIds);

    expect(orderData.product.updated).toEqual(false);
})


test('should return proper confirmation data for updated ordered', async () => {
    const order = testShoppingCart.orders[0];
    const listOfUpdatedIds = [order.id];
    const orderData = await service.getConfirmationProductData(order, clientData, "de", productOffersMock, productImageServiceMock, defaultConfirmationTextsDE, listOfUpdatedIds);

    expect(orderData.product.updated).toEqual(true);
})

test("should return proper confirmation component data for updated shoppingCart", async () => {
    const clientComponentTextService = {
        getComponentTextsForClientAndLocal: () => defaultConfirmationTextsDE
    };

    const shoppingCartServiceMock = {
        syncShoppingCart: (wertgarantieShoppingCart) => {
            return {
                shoppingCart: wertgarantieShoppingCart,
                changes: {
                    updated: [
                        {
                            id: testShoppingCart.orders[0].id,
                            wertgarantieProductPriceChanged: true
                        },
                        {
                            id: testShoppingCart.orders[1].id,
                            wertgarantieProductPriceChanged: true
                        }
                    ],
                    deleted: []
                }
            }
        }
    };

    const confirmationData = await service.prepareConfirmationData(testShoppingCart, clientData, undefined, undefined, productOffersMock, productImageServiceMock, clientComponentTextService, shoppingCartServiceMock);
    expect(confirmationData.instance).toEqual(updatedShoppingCartExpectedResponse);
});


test("should return undefined if no shopping cart is given", async () => {
    const result = await service.prepareConfirmationData(undefined);
    expect(result).toEqual(undefined);
});

