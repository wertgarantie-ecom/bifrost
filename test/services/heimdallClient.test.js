const heimdallClient = require('../../src/backends/heimdall/heimdallClient');
const uuid = require('uuid');
const heimdallTestProducts = require('./heimdallTestProducts').heimdallTestProducts;

test('should retrieve product-offers from heimdall', async () => {
    const client = {
        id: uuid(),
        name: "heimdallClient-testclient",
        secrets: [uuid() + ""],
        publicClientIds: [uuid() + ""]
    }

    const mockHttpClient = jest.fn(() => {
        return {
            data: heimdallTestProducts
        }
    });

    const productOffers = await heimdallClient.getProductOffers(client, "device_class", 100000, new Date(2020, 1, 1), mockHttpClient);

    expect(mockHttpClient.mock.calls[1][0].url).toBe("http://heimdallDummyUrl/api/v1/product-offers?device_class=device_class&device_purchase_price=1000&device_purchase_date=2020-02-01");
})