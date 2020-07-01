const afterSalesService = require('../../../src/components/aftersales/afterSalesService');
const defaultAfterSalesTextsForDE = require('../../../src/clientconfig/defaultComponentTexts').defaultComponentTexts.aftersales.de;
const uuid = require('uuid');
const clientComponentTextService = {
    getComponentTextsForClientAndLocal: () => defaultAfterSalesTextsForDE
};

test('should return proper after sales data for checkout data', async () => {
    const sessionId = "0b511572-3aa3-4706-8146-d109693cfe37";
    const checkoutRepository = {
        findBySessionId: () => {
            return {
                clientId: "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
                sessionId: sessionId,
                traceId: "563e6720-5f07-42ad-99c3-a5104797f083",
                purchases: [
                    {
                        id: "271c7676-ebf7-407f-abce-685aafc61c4b",
                        wertgarantieProductId: 4,
                        wertgarantieProductName: "Premium",
                        deviceClass: "1dfd4549-9bdc-4285-9047-e5088272dade",
                        devicePrice: 86000,
                        success: true,
                        message: "successfully transmitted insurance proposal",
                        shopProduct: "Flash Handy 3000 Pro",
                        contractNumber: 28850277,
                        transactionNumber: 28850277,
                        activationCode: "4db56dacfbhce",
                        backgroundStyle: "primary",
                        productImageLink: "linkToProductImage"
                    }
                ]
            }
        }
    };
    const result = await afterSalesService.showAfterSalesComponent(sessionId, 'test shop', 'de', undefined, checkoutRepository, clientComponentTextService);
    expect(result.texts.success.title).toEqual('Länger Freude am Einkauf');
    expect(result.texts.success.subtitle).toEqual('Folgende Geräte werden übermittelt');
    expect(result.texts.success.contractNumber).toEqual('Auftragsnummer:');
    expect(result.texts.success.nextStepsTitle).toEqual('Die nächsten Schritte');
    expect(result.texts.success.nextSteps).toEqual(["E-Mail-Postfach überprüfen", "Mit wenigen Schritten absichern", "Sofortige Hilfe erhalten, wenn es zählt"]);
    expect(result.successfulOrders.length).toEqual(1);
    expect(result.successfulOrders[0]).toEqual({
        "insuranceProductTitle": "Premium",
        "productTitle": "Flash Handy 3000 Pro",
        "contractNumber": 28850277,
        "productImageLink": "linkToProductImage",
        "backgroundStyle": "primary"
    });
});

test('should return failed orders', async () => {
    const sessionId = uuid;
    const checkoutRepository = {
        findBySessionId: () => {
            return {
                clientId: "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
                sessionId: sessionId,
                traceId: "563e6720-5f07-42ad-99c3-a5104797f083",
                purchases: [
                    {
                        success: false,
                    }
                ]
            }
        }
    };

    const result = await afterSalesService.showAfterSalesComponent(sessionId, 'test shop', "de", undefined, checkoutRepository, clientComponentTextService);
    expect(result).toEqual(undefined);
});

test('should return undefined for missing wertgarantie shopping cart', async () => {
    const result = await afterSalesService.checkoutAndShowAfterSalesComponent(undefined, {});
    expect(result).toBe(undefined);
});
