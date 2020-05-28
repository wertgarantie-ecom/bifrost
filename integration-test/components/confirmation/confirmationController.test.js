const request = require('supertest');
const app = require('../../../src/app');
const testhelper = require('../../helper/fixtureHelper');
const webservicesProductOffersAssembler = require('../../../src/backends/webservices/webservicesProductOffersAssembler');
const mockWebservicesClient = require('../../../test/helpers/webserviceMockClient').createMockWebserviceClientWithPhoneConfig();
const productOffersService = require('../../../src/productoffers/productOffersService');

beforeAll(() => {
    process.env = Object.assign(process.env, {BACKEND: "webservices"});

});

test('should reject confirm request for missing shopping cart', async () => {
    const clientData = await testhelper.createAndPersistDefaultClientWithWebservicesConfiguration();
    const result = await request(app)
        .put(`/wertgarantie/ecommerce/clients/${clientData.publicClientIds[0]}/components/confirmation/confirm`)
        .send({signedShoppingCart: {}})
        .set('Accept', 'application/json');

    expect(result.status).toBe(400);
});

test('should handle shopping cart confirmation', async function () {
    const clientData = await testhelper.createAndPersistDefaultClientWithWebservicesConfiguration();
    const agent = request.agent(app);
    const signedShoppingCart = testhelper.createSignedShoppingCart();

    const result = await agent.put(`/wertgarantie/ecommerce/clients/${clientData.publicClientIds[0]}/components/confirmation/termsAndConditionsConfirmed`)
        .send({signedShoppingCart: signedShoppingCart})
        .set('Accept', 'application/json');

    expect(result.status).toBe(200);
    expect(result.body.signedShoppingCart.shoppingCart.confirmations.termsAndConditionsConfirmed).toBe(true);
});

describe('should handle shopping cart confirmation rejection', function () {
    let clientData;
    const agent = request.agent(app);
    const signedShoppingCart = testhelper.createSignedShoppingCart();

    it('confirm shopping cart', async function () {
        clientData = await testhelper.createAndPersistDefaultClientWithWebservicesConfiguration();
        const result = await agent.put(`/wertgarantie/ecommerce/clients/${clientData.publicClientIds[0]}/components/confirmation/termsAndConditionsConfirmed`)
            .send({signedShoppingCart: signedShoppingCart})
            .set('Accept', 'application/json');
        expect(result.status).toBe(200);
    });

    it('unconfirm shopping cart', async function () {
        const result = await agent.delete(`/wertgarantie/ecommerce/clients/${clientData.publicClientIds[0]}/components/confirmation/termsAndConditionsConfirmed`)
            .send({signedShoppingCart: signedShoppingCart})
            .set('Accept', 'application/json');

        expect(result.status).toBe(200);
        expect(result.body.signedShoppingCart.shoppingCart.confirmations.termsAndConditionsConfirmed).toBe(false);
    });
});


test("should return valid confirmation data", async () => {
    const clientData = await testhelper.createAndPersistDefaultClientWithWebservicesConfiguration();
    const productOffers = await webservicesProductOffersAssembler.updateAllProductOffersForClient(clientData, undefined, mockWebservicesClient);
    const signedShoppingCart = testhelper.createSignedShoppingCart({
        publicClientId: clientData.publicClientIds[0],
        deviceClass: "Smartphone",
        model: "Test Handy",
        wertgarantieProductId: productOffers[0].id,
        wertgarantieProductName: productOffers[0].name
    });

    const response = await request.agent(app).put(`/wertgarantie/ecommerce/clients/${clientData.publicClientIds[0]}/components/confirmation`)
        .send({signedShoppingCart: signedShoppingCart});
    expect(response.status).toBe(200);
    expect(response.body.signedShoppingCart).toEqual(signedShoppingCart);
    expect(response.body.shoppingCart).toEqual(undefined);
    expect(response.body.termsAndConditionsConfirmed).toEqual(false);
    expect(response.body.orders.length).toEqual(1);
    expect(response.body.texts).toEqual({
        boxTitle: "Versicherung",
        title: "Glückwunsch! Dieser Einkauf wird bestens abgesichert",
        priceChangedWarning: "Der Preis deiner Versicherung hat sich geändert!",
        subtitle: "Bitte bestätige noch kurz:",
        confirmationTextTermsAndConditions: "Ich akzeptiere die Allgemeinen Versicherungsbedingungen <a target=\"_blank\" href=\"undefined/wertgarantie/documents/9448f030d5684ed3d587aa4e6167a1fd918aa47b\">(AVB)</a> und die Bestimmungen zum <a target=\"_blank\" href=\"undefined/wertgarantie/documents/e2289cb6c7e945f4e79bab6b250cb0be34a9960e\">Datenschutz</a>. Das gesetzliche <a target=\"_blank\" href=\"undefined/wertgarantie/documents/6a9715485af877495e38b24b093d603436c433eb\">Widerrufsrecht</a>, das Produktinformationsblatt <a target=\"_blank\" href=\"undefined/wertgarantie/documents/8835ff3c803f3e7abc5d49527001678bb179cfaa\">(IPID)</a> und die Vermittler-Erstinformation habe ich zur Kenntnis genommen und alle Dokumente heruntergeladen. Mit der Bestätigung der Checkbox erkläre ich mich damit einverstanden, dass mir alle vorstehenden Unterlagen an meine E-Mail-Adresse übermittelt werden. Der Übertragung der erforderlichen Daten zur Übermittlung meines Versicherungsantrages an die WERTGARANTIE AG per E-Mail stimme ich zu. Der Betrag wird separat per Rechnung bezahlt.",
        confirmationPrompt: "Bitte bestätige die oben stehenden Bedingungen um fortzufahren."
    });
});

test("should remove order from shopping cart", async () => {
    const clientData = await testhelper.createAndPersistDefaultClientWithWebservicesConfiguration();
    const productOffers = await webservicesProductOffersAssembler.updateAllProductOffersForClient(clientData, undefined, mockWebservicesClient);
    const signedShoppingCart = testhelper.createSignedShoppingCart({
        publicClientId: clientData.publicClientIds[0],
        deviceClass: "Smartphone",
        model: "Test Handy",
        wertgarantieProductId: productOffers[0].id,
        wertgarantieProductName: productOffers[0].name,
        quantity: 2
    });

    const response = await request.agent(app).delete(`/wertgarantie/ecommerce/clients/${clientData.publicClientIds[0]}/components/confirmation/product`)
        .send({
            orderId: signedShoppingCart.shoppingCart.orders[0].id,
            signedShoppingCart: signedShoppingCart
        });
    expect(response.status).toBe(200);
    expect(response.body.signedShoppingCart.shoppingCart.orders.length).toEqual(1);
    expect(response.body.signedShoppingCart.shoppingCart.orders[0]).toEqual(signedShoppingCart.shoppingCart.orders[1]);
    expect(response.body.termsAndConditionsConfirmed).toEqual(false);
    expect(response.body.orders.length).toEqual(1);
});


test('should return proper data if wertgarantieShoppingCart must be synced with shop provided cart', async () => {
    const clientData = await testhelper.createAndPersistDefaultClientWithWebservicesConfiguration();
    const productOffers = await webservicesProductOffersAssembler.updateAllProductOffersForClient(clientData, undefined, mockWebservicesClient);
    const deviceClass = "Smartphone";
    const selectedWertgarantieProduct = productOffers[0].id;
    const signedShoppingCart = testhelper.createSignedShoppingCart({
        publicClientId: clientData.publicClientIds[0],
        devicePrice: 80000,
        deviceClass: deviceClass,
        model: "Test Handy",
        wertgarantieProductId: selectedWertgarantieProduct,
        wertgarantieProductName: productOffers[0].name
    });

    const wertgarantieOrder = signedShoppingCart.shoppingCart.orders[0];
    const orderItemId = wertgarantieOrder.shopProduct.orderItemId;

    const shopShoppingCart = [
        {
            price: 180000,
            model: "IPhone 3000GB",
            orderItemId: orderItemId
        }
    ]
    const encodedShopShoppingCart = Buffer.from(JSON.stringify(shopShoppingCart)).toString("base64");

    const expectedPrice = await productOffersService.getPriceForSelectedProductOffer(clientData, deviceClass, selectedWertgarantieProduct, shopShoppingCart[0].price, wertgarantieOrder.wertgarantieProduct.paymentInterval);

    const response = await request.agent(app).put(`/wertgarantie/ecommerce/clients/${clientData.publicClientIds[0]}/components/confirmation`)
        .send({
            signedShoppingCart: signedShoppingCart,
            shopShoppingCart: encodedShopShoppingCart
        });

    expect(response.status).toBe(200);
    expect(response.body.signedShoppingCart.shoppingCart.orders[0]).toEqual({
        "id": wertgarantieOrder.id,
        "shopProduct": {
            "deviceClass": "Smartphone",
            "model": shopShoppingCart[0].model,
            "orderItemId": orderItemId,
            "price": shopShoppingCart[0].price
        },
        "wertgarantieProduct": {
            "id": selectedWertgarantieProduct,
            "name": "Komplettschutz",
            "paymentInterval": "monthly",
            "price": expectedPrice
        }
    });
})