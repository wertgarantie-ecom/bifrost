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
                "sessionId": sessionId + "",
                "clientId": clientData.id,
                "products": [
                    {
                        "wertgarantieProductId": wertgarantieProductId,
                        "wertgarantieProductName": wertgarantieProductName,
                        "deviceClass": "fbfb2d44-4ff8-4579-9cc0-0a3ccb8d6f2d",
                        "devicePrice": 139999,
                        "deviceCurrency": "EUR",
                        "shopProductName": "SuperBike 3000",
                        "orderId": "ef6ab539-13d8-451c-b8c3-aa2c498f8e46"
                    }
                ],
                "legalAgeConfirmed": true,
                "termsAndConditionsConfirmed": true
            };

        nockhelper.nockHeimdallLogin(clientData);
        nockhelper.nockHeimdallCheckoutShoppingCart(wertgarantieProductId, {
            payload: {
                contract_number: "1234",
                transaction_number: "28850277",
                activation_code: "4db56dacfbhce",
                message: "Der Versicherungsantrag wurde erfolgreich übermittelt."
            }
        });

        await request(app).post("/wertgarantie/shoppingCarts/current/checkout")
            .send({
                purchasedProducts: [{
                    price: 139999,
                    manufacturer: "Super Bike Inc.",
                    deviceClass: "fbfb2d44-4ff8-4579-9cc0-0a3ccb8d6f2d",
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
    });

    test("should get proper after sales component data", async () => {
        const result = await request(app).get('/wertgarantie/components/after-sales/' + sessionId).set('X-wertgarantie-session-id', sessionId);
        const resultBody = result.body;
        expect(resultBody.headerTitle).toEqual('Ihre Geräte wurden erfolgreich versichert!');
        expect(resultBody.productBoxTitle).toEqual('Folgende Geräte wurden versichert:');
        expect(resultBody.nextStepsTitle).toEqual('Die nächsten Schritte:');
        expect(resultBody.nextSteps).toEqual(['Sie erhalten eine E-Mail mit Informationen zum weiteren Vorgehen', 'Bitte aktivieren Sie nach Erhalt ihres Produktes die Versicherung mit unserer Fraud-Protection App.']);
        expect(resultBody.orderItems.length).toEqual(1);
        expect(resultBody.orderItems[0]).toEqual({
            "insuranceProductTitle": "Basic",
            "productTitle": "SuperBike 3000",
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
                "sessionId": sessionId + "",
                "publicClientId": clientData.publicClientIds[0],
                "products": [
                    {
                        "wertgarantieProductId": wertgarantieProductId,
                        "wertgarantieProductName": wertgarantieProductName,
                        "deviceClass": "fbfb2d44-4ff8-4579-9cc0-0a3ccb8d6f2d",
                        "devicePrice": 139999,
                        "deviceCurrency": "EUR",
                        "shopProductName": "SuperBike 3000",
                        "orderId": "ef6ab539-13d8-451c-b8c3-aa2c498f8e46"
                    }
                ],
                "legalAgeConfirmed": true,
                "termsAndConditionsConfirmed": true
            };
        const webshopData = {
            purchasedProducts: [{
                price: 139999,
                manufacturer: "Super Bike Inc.",
                deviceClass: "fbfb2d44-4ff8-4579-9cc0-0a3ccb8d6f2d",
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
                contract_number: "1234",
                transaction_number: "28850277",
                activation_code: "4db56dacfbhce",
                message: "Der Versicherungsantrag wurde erfolgreich übermittelt."
            }
        });

        const result = await request(app).post("/wertgarantie/components/after-sales/checkout")
            .send({
                webshopData: webshopData,
                signedShoppingCart: signatureService.signShoppingCart(wertgarantieShoppingCart)
            });
        const resultBody = result.body;
        expect(resultBody.headerTitle).toEqual('Ihre Geräte wurden erfolgreich versichert!');
        expect(resultBody.productBoxTitle).toEqual('Folgende Geräte wurden versichert:');
        expect(resultBody.nextStepsTitle).toEqual('Die nächsten Schritte:');
        expect(resultBody.nextSteps).toEqual(['Sie erhalten eine E-Mail mit Informationen zum weiteren Vorgehen', 'Bitte aktivieren Sie nach Erhalt ihres Produktes die Versicherung mit unserer Fraud-Protection App.']);
        expect(resultBody.orderItems.length).toEqual(1);
        expect(resultBody.orderItems[0]).toEqual({
            "insuranceProductTitle": "Basic",
            "productTitle": "SuperBike 3000",
            "imageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png"
        });

        expect(result.get('X-wertgarantie-shopping-cart-delete')).toBe("true");
    });
});