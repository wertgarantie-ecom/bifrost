const afterSalesService = require('../../src/services/afterSalesService');

test('should return proper after sales data for checkout data', async () => {
    const mockProductImageService = {
        getRandomImageLinksForDeviceClass: () => ["https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Premium.png"]
    }

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
                        activationCode: "4db56dacfbhce"
                    }
                ]
            }
        }
    };
    const result = await afterSalesService.prepareAfterSalesData(sessionId, checkoutRepository);
    expect(result.headerTitle).toEqual('Ihre Geräte wurden erfolgreich versichert!');
    expect(result.productBoxTitle).toEqual('Folgende Geräte wurden versichert:');
    expect(result.nextStepsTitle).toEqual('Die nächsten Schritte:');
    expect(result.nextSteps).toEqual(['Sie erhalten eine E-Mail mit Informationen zum weiteren Vorgehen', 'Bitte aktivieren Sie nach Erhalt ihres Produktes die Versicherung mit unserer Fraud-Protection App.']);
    expect(result.orderItems.length).toEqual(1);
    expect(result.orderItems[0]).toEqual({
        "imageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Premium.png",
        "insuranceProductTitle": "Premium",
        "productTitle": "Flash Handy 3000 Pro"
    });
});

