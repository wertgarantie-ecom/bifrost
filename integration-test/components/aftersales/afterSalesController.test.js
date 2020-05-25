const request = require('supertest');
const app = require('../../../src/app');
const testhelper = require('../../helper/fixtureHelper');
const signatureService = require('../../../src/shoppingcart/signatureService');
const uuid = require('uuid');
const nockhelper = require('../../helper/nockHelper');

describe("Check Preparation of After Sales Component Data when checkout happens via shop call", () => {
    let clientData;
    const sessionId = uuid();

    test("checkout shopping cart", async () => {
        clientData = await testhelper.createAndPersistDefaultClient();
        const wertgarantieProductId = "10";
        const wertgarantieProductName = 'Basic';
        const wertgarantieShoppingCart =
            {
                sessionId: sessionId + "",
                publicClientId: clientData.publicClientIds[0],
                orders: [
                    {
                        id: "ef6ab539-13d8-451c-b8c3-aa2c498f8e46",
                        shopProduct: {
                            model: "SuperBike 3000",
                            deviceClass: "Test",
                            price: 139999
                        },
                        wertgarantieProduct: {
                            id: wertgarantieProductId,
                            name: wertgarantieProductName,
                            paymentInterval: "monthly"
                        }
                    }
                ],
                confirmations: {
                    termsAndConditionsConfirmed: true

                }
            };

        nockhelper.nockHeimdallLogin(clientData);
        nockhelper.nockHeimdallCheckoutShoppingCart(wertgarantieProductId, {
            payload: {
                contract_number: 1234,
                transaction_number: "28850277",
                activation_code: "4db56dacfbhce",
                message: "Der Versicherungsantrag wurde erfolgreich übermittelt."
            }
        });

        const response = await request(app).post("/wertgarantie/shoppingCarts/current/checkout")
            .send({
                purchasedProducts: [{
                    price: 139999,
                    manufacturer: "Super Bike Inc.",
                    deviceClass: "Test",
                    model: "SuperBike 3000"
                }],
                customer: {
                    company: "INNOQ",
                    salutation: "Herr",
                    firstname: "Max",
                    lastname: "Mustermann",
                    street: "Unter den Linden",
                    zip: "52345",
                    city: "Köln",
                    country: "Deutschland",
                    email: "max.mustermann1234@test.com"
                },
                signedShoppingCart: signatureService.signShoppingCart(wertgarantieShoppingCart),
                secretClientId: clientData.secrets[0]
            });
        expect(response.statusCode).toBe(200);
    });

    test("should get proper after sales component data", async () => {
        const result = await request(app).get('/wertgarantie/components/after-sales/' + sessionId).set('X-wertgarantie-session-id', sessionId);
        const resultBody = result.body;
        expect(resultBody.texts.success.title).toEqual('Länger Freude am Einkauf');
        expect(resultBody.texts.success.subtitle).toEqual('Folgende Geräte werden übermittelt');
        expect(resultBody.texts.success.contractNumber).toEqual('Auftragsnummer:');
        expect(resultBody.texts.success.nextStepsTitle).toEqual('Die nächsten Schritte');
        expect(resultBody.texts.success.nextSteps).toEqual(["E-Mail-Postfach überprüfen", "Mit wenigen Schritten absichern", "Sofortige Hilfe erhalten, wenn es zählt"]);
        expect(resultBody.successfulOrders.length).toEqual(1);
        expect(resultBody.successfulOrders[0]).toEqual({
            "insuranceProductTitle": "Basic",
            "productTitle": "SuperBike 3000",
            "contractNumber": 1234,
            "imageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png"
        });

        expect(result.get('X-wertgarantie-shopping-cart-delete')).toBe("true");

    });
});

describe("Check Checkout via after sales component ", () => {
    test("checkout via component", async () => {
        const sessionId = uuid();
        const clientData = await testhelper.createAndPersistDefaultClient();
        const encryptedSessionId = signatureService.signString(sessionId, clientData.secrets[0]);
        const wertgarantieProductId = "10";
        const wertgarantieProductName = 'Basic';
        const wertgarantieShoppingCart =
            {
                sessionId: sessionId + "",
                publicClientId: clientData.publicClientIds[0],
                orders: [
                    {
                        id: "ef6ab539-13d8-451c-b8c3-aa2c498f8e46",
                        shopProduct: {
                            model: "SuperBike 3000",
                            deviceClass: "Test",
                            price: 139999
                        },
                        wertgarantieProduct: {
                            id: wertgarantieProductId,
                            name: wertgarantieProductName,
                            paymentInterval: "monthly"
                        }
                    }
                ],
                confirmations: {
                    termsAndConditionsConfirmed: true

                }
            };
        const webshopData = {
            purchasedProducts: [{
                price: 139999,
                manufacturer: "Super Bike Inc.",
                deviceClass: "Test",
                model: "SuperBike 3000"
            }],
            customer: {
                company: "INNOQ",
                salutation: "Herr",
                firstname: "Max",
                lastname: "Mustermann",
                street: "Unter den Linden",
                zip: "52345",
                city: "Köln",
                country: "Deutschland",
                email: "max.mustermann1234@test.com"
            },
            encryptedSessionId: encryptedSessionId
        };

        nockhelper.nockHeimdallLogin(clientData);
        nockhelper.nockHeimdallCheckoutShoppingCart(wertgarantieProductId, {
            payload: {
                contract_number: 1234,
                transaction_number: "28850277",
                activation_code: "4db56dacfbhce",
                message: "Der Versicherungsantrag wurde erfolgreich übermittelt."
            }
        });
        const base64WebshopData = Buffer.from(JSON.stringify(webshopData)).toString('base64');

        const result = await request(app).post("/wertgarantie/components/after-sales/checkout")
            .send({
                webshopData: base64WebshopData,
                signedShoppingCart: signatureService.signShoppingCart(wertgarantieShoppingCart)
            });
        const resultBody = result.body;
        expect(resultBody.texts.success.title).toEqual('Länger Freude am Einkauf');
        expect(resultBody.texts.success.subtitle).toEqual('Folgende Geräte werden übermittelt');
        expect(resultBody.texts.success.contractNumber).toEqual('Auftragsnummer:');
        expect(resultBody.texts.success.nextStepsTitle).toEqual('Die nächsten Schritte');
        expect(resultBody.texts.success.nextSteps).toEqual(["E-Mail-Postfach überprüfen", "Mit wenigen Schritten absichern", "Sofortige Hilfe erhalten, wenn es zählt"]);
        expect(resultBody.successfulOrders.length).toEqual(1);
        expect(resultBody.successfulOrders[0]).toEqual({
            "insuranceProductTitle": "Basic",
            "productTitle": "SuperBike 3000",
            "contractNumber": 1234,
            "imageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png"
        });

        expect(result.get('X-wertgarantie-shopping-cart-delete')).toBe("true");
    });
});