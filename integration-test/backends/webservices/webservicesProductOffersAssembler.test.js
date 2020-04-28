const webservicesProductOffersAssembler = require('../../../src/backends/webservices/webservicesProductOffersAssembler');
const fixtures = require('../../helper/fixtureHelper');
const webserviceMockClient = require('../../../test/helpers/webserviceMockClient').createMockWebserviceClient();
const nockHelper = require('../../helper/nockHelper');

describe('should persist product offers', () => {

    test('should update product offers', async () => {
        const client = await fixtures.createAndPersistDefaultClientWithWebservicesConfiguration();
        const productOffers = await webservicesProductOffersAssembler.updateAllProductOffersForClient(client, undefined, webserviceMockClient);

        expect(productOffers.length).toEqual(2);
    });

});
