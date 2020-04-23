const checkoutService = require('../../../src/backends/heimdall/heimdallCheckoutService');
const validCustomer = require('../../../integration-test/helper/fixtureHelper').validCustomer;

test("shopping cart checkout should checkout wertgarantie product if referenced shop product was also purchased", async () => {
    const wertgarantieProduct = {
        wertgarantieProductId: "2",
        wertgarantieProductName: "Komplettschutz",
        deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
        devicePrice: "100000",
        shopProductName: "IPhone X",
        orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
    };

    const purchasedShopProduct = {
        price: "100000",
        manufacturer: "Apple Inc",
        deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
        model: "IPhone X",
        productId: "1"
    };
    const customer = validCustomer();
    const client = {
        "name": "bikeShop",
        "publicClientIds": ["5209d6ea-1a6e-11ea-9f8d-778f0ad9137f"],
        "secrets": ["bikesecret1"]
    };
    const mockHeimdallClient = mockHeimdallClientSuccess();

    const result = await checkoutService.checkout(client,
        wertgarantieProduct,
        customer,
        purchasedShopProduct,
        new Date(2019, 5, 1, 8, 34, 34, 345),
        mockHeimdallClient,
        () => "2fcb053d-873c-4046-87e4-bbd75566901d");

    expect(mockHeimdallClient.sendWertgarantieProductCheckout.mock.calls[0][0]).toEqual({
        productId: "2",
        customer_company: 'INNOQ',
        customer_salutation: 'Herr',
        customer_firstname: 'Max',
        customer_lastname: 'Mustermann',
        customer_street: 'Unter den Linden',
        customer_zip: '52345',
        customer_city: 'Köln',
        customer_country: 'Deutschland',
        customer_email: 'max.mustermann1234@test.com',
        customer_birthdate: "1911-11-11",
        device_manufacturer: 'Apple Inc',
        device_model: 'IPhone X',
        device_class: '6bdd2d93-45d0-49e1-8a0c-98eb80342222',
        device_purchase_price: 1000,
        device_purchase_date: "2019-06-01",
        device_condition: 1,
        payment_method: "jährlich",
        payment_type: 'bank_transfer',
        terms_and_conditions_accepted: true
    });
    expect(mockHeimdallClient.sendWertgarantieProductCheckout.mock.calls[0][1]).toEqual(client);

    await expect(result).toEqual({
        "id": "2fcb053d-873c-4046-87e4-bbd75566901d",
        "wertgarantieProductId": "2",
        "deviceClass": "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
        "devicePrice": "100000",
        "success": true,
        "message": "successfully transmitted insurance proposal",
        "shopProduct": "IPhone X",
        "activationCode": "123456",
        "contractNumber": "28850277",
        "transactionNumber": "28850279",
        "backend": "heimdall",
        "wertgarantieProductName": "Komplettschutz"
    });
});

test("failing heimdall checkout call should be handled gracefully", async () => {
    const wertgarantieProduct = {
        wertgarantieProductId: "2",
        wertgarantieProductName: "Komplettschutz",
        deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
        devicePrice: "1000",
        shopProductName: "IPhone X",
        orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
    };

    const shopProduct = {
        price: "1000",
        manufacturer: "Apple Inc",
        deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
        model: "IPhone X",
        productId: "1"
    };

    const customer = validCustomer();

    const mockHeimdallClient = {
        sendWertgarantieProductCheckout: jest.fn(() => {
            throw new Error("failing call");
        })
    };

    const result = await checkoutService.checkout(undefined, wertgarantieProduct, customer, shopProduct,
        undefined,
        mockHeimdallClient,
        () => "bda6d0f8-bbfa-4ede-a8c4-4a95ad0b3f75");
    const expectedResult = {
        "id": "bda6d0f8-bbfa-4ede-a8c4-4a95ad0b3f75",
        "wertgarantieProductId": "2",
        "wertgarantieProductName": "Komplettschutz",
        "deviceClass": "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
        "devicePrice": "1000",
        "success": false,
        "message": "failing call",
        "shopProduct": "IPhone X",
        "backend": "heimdall"
    };
    expect(result).toEqual(expectedResult);
});

const mockHeimdallClientSuccess = () => {
    return {
        sendWertgarantieProductCheckout: jest.fn(() => {
            return {
                payload: {
                    activation_code: "123456",
                    contract_number: "28850277",
                    transaction_number: "28850279",
                    message: "Der Versicherungsantrag wurde erfolgreich übermittelt."
                }
            }
        })
    }
};
