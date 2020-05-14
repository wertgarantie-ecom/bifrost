const service = require('../../../src/components/confirmation/confirmationComponentService');
const productOffersTestResponse = require('../../productoffer/productOffersTestResponses').productOffers;
const defaultConfirmationTextsDE = require('../../../src/clientconfig/defaultComponentTexts').defaultComponentTexts.confirmation.de;

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
    termsAndConditionsConfirmed: true,
    texts: {
        title: 'Glückwunsch! Du hast den besten Schutz für deinen Einkauf ausgewählt!',
        subtitle: 'Bitte bestätige noch kurz:',
        confirmationPrompt: "Bitte bestätige die oben stehenden Bedingungen um fortzufahren.",
        confirmationTextTermsAndConditions: "Ich akzeptiere die Allgemeinen Versicherungsbedingungen <a target=\"_blank\" href=\"http://localhost:3000/documents/justnotthere\">(AVB)</a> und die Bestimmungen zum <a target=\"_blank\" href=\"http://localhost:3000/documents/justnotthere\">Datenschutz</a>. Das gesetzliche <a target=\"_blank\" href=\"http://localhost:3000/documents/justnotthere\">Widerrufsrecht</a>, das Produktinformationsblatt <a target=\"_blank\" href=\"http://localhost:3000/documents/justnotthere\">(IPID)</a> und die Vermittler-Erstinformation habe ich zur Kenntnis genommen und alle Dokumente heruntergeladen. Mit der Bestätigung der Checkbox erkläre ich mich damit einverstanden, dass mir alle vorstehenden Unterlagen an meine E-Mail-Adresse übermittelt werden. Der Übertragung meiner Daten an Wertgarantie stimme ich zu. Der Betrag wird separat per Rechnung bezahlt.",
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
            orderId: "28ff0413-bcfd-48f8-b003-04b57762067a"
        },
    ],
};


test("should return proper confirmation component data for one product", async () => {
    console.log("test");
    const clientComponentTextService = {
        getComponentTextsForClientAndLocal: () => defaultConfirmationTextsDE
    };
    const confirmationData = await service.prepareConfirmationData(
        testShoppingCart,
        undefined,
        undefined,
        productOffersMock,
        productImageServiceMock,
        mockClientService(clientData),
        clientComponentTextService
    );
    expect(confirmationData.instance).toEqual(expectedResponse);
});

test("should return undefined if no shopping cart is given", async () => {
    const result = await service.prepareConfirmationData(undefined);
    expect(result).toEqual(undefined);
});


test("should not update wertgarantieShoppingCart if no orderItemIds are available in wertgarantieShoppingCart", () => {
        const shopShoppingCart = [
            {
                price: 10000,
                manufacturer: "Apple Inc",
                deviceClass: "Smartphone",
                model: "IPhone X",
                orderItemId: "orderItemId"
            }
        ];

        const wertgarantieShoppingCart = {
            orders: [
                {
                    id: "18ff0413-bcfd-48f8-b003-04b57762067a",
                    shopProduct: {
                        price: 10000,
                        deviceClass: "Smartphone",
                        model: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        paymentInterval: "monthly"
                    }
                },
            ],
        }

        const updatedWertgarantieShoppingCart = service.updateWertgarantieShoppingCart(wertgarantieShoppingCart, shopShoppingCart);
        expect(updatedWertgarantieShoppingCart.orders).toEqual(wertgarantieShoppingCart.orders);
    }
)

test("should keept wertgarantieShoppingCart of not shopShoppingCart is provieded", () => {
        const shopShoppingCart = undefined;

        const wertgarantieShoppingCart = {
            orders: [
                {
                    id: "18ff0413-bcfd-48f8-b003-04b57762067a",
                    shopProduct: {
                        price: 10000,
                        deviceClass: "Smartphone",
                        orderItemId: "orderItemId",
                        model: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        paymentInterval: "monthly"
                    }
                },
            ],
        }

        const updatedWertgarantieShoppingCart = service.updateWertgarantieShoppingCart(wertgarantieShoppingCart, shopShoppingCart);
        expect(updatedWertgarantieShoppingCart.orders).toEqual(wertgarantieShoppingCart.orders);
    }
)

test("should keep wertgarantieShoppingCart order if it matches with shopShoppingCart", () => {
        const shopShoppingCart = [
            {
                price: 10000,
                manufacturer: "Apple Inc",
                deviceClass: "Smartphone",
                orderItemId: "orderItemId",
                model: "IPhone X"
            }
        ];

        const wertgarantieShoppingCart = {
            orders: [
                {
                    id: "18ff0413-bcfd-48f8-b003-04b57762067a",
                    shopProduct: {
                        price: 10000,
                        deviceClass: "Smartphone",
                        orderItemId: "orderItemId",
                        model: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        paymentInterval: "monthly"
                    }
                },
            ],
        }

        const updatedWertgarantieShoppingCart = service.updateWertgarantieShoppingCart(wertgarantieShoppingCart, shopShoppingCart);
        expect(updatedWertgarantieShoppingCart.orders).toEqual(wertgarantieShoppingCart.orders);
    }
)

test("should remove wertgarantieShoppingCart order with orderItemId if no match in shoppingCart was found", () => {
        const shopShoppingCart = [
            {
                price: 10000,
                manufacturer: "Apple Inc",
                deviceClass: "Smartphone",
                orderItemId: "anotherOrderItemId",
                model: "IPhone X"
            }
        ];

        const wertgarantieShoppingCart = {
            orders: [
                {
                    id: "18ff0413-bcfd-48f8-b003-04b57762067a",
                    shopProduct: {
                        price: 10000,
                        deviceClass: "Smartphone",
                        orderItemId: "orderItemId",
                        model: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        paymentInterval: "monthly"
                    }
                },
            ],
        }

        const updatedWertgarantieShoppingCart = service.updateWertgarantieShoppingCart(wertgarantieShoppingCart, shopShoppingCart);
        expect(updatedWertgarantieShoppingCart.orders).toEqual([]);
    }
)


test("should update wertgarantieShoppingCart order if price of matching shopShoppingCart item does not match", () => {
        const shopShoppingCart = [
            {
                price: 20000,
                manufacturer: "Apple Inc",
                deviceClass: "Smartphone",
                orderItemId: "orderItemId",
                model: "IPhone X"
            }
        ];

        const wertgarantieShoppingCart = {
            orders: [
                {
                    id: "18ff0413-bcfd-48f8-b003-04b57762067a",
                    shopProduct: {
                        price: 10000,
                        deviceClass: "Smartphone",
                        orderItemId: "orderItemId",
                        model: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        paymentInterval: "monthly"
                    }
                },
            ],
        }

        const updatedWertgarantieShoppingCart = service.updateWertgarantieShoppingCart(wertgarantieShoppingCart, shopShoppingCart);
        expect(updatedWertgarantieShoppingCart.orders[0]).toEqual({});
    }
)
