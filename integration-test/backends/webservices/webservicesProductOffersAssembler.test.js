const webservicesProductOffersAssembler = require('../../../src/backends/webservices/webservicesProductOffersAssembler');
const fixtures = require('../../helper/fixtureHelper');
const webserviceMockClientWithPhoneConfig = require('../../../test/helpers/webserviceMockClient').createMockWebserviceClientWithPhoneConfig();
const webserviceMockClientWithBikeConfig = require('../../../test/helpers/webserviceMockClient').createMockWebserviceClientWithBikeConfig();

describe('should persist product offers for phone shop', () => {

    test('should update product offers', async () => {
        const client = await fixtures.createAndPersistDefaultClientWithWebservicesConfiguration();
        const productOffers = await webservicesProductOffersAssembler.updateAllProductOffersForClient(client, undefined, webserviceMockClientWithPhoneConfig);

        expect(productOffers.length).toEqual(2);
        expect(productOffers[0].name).toEqual("Komplettschutz");
        expect(productOffers[1].name).toEqual("Komplettschutz mit Premium-Option");
    });

});

describe('should persist product offers for Bike shop', () => {

    test('should update product offers', async () => {
        const client = await fixtures.createAndPersistBikeClientWithWebservicesConfiguration();
        const productOffers = await webservicesProductOffersAssembler.updateAllProductOffersForClient(client, undefined, webserviceMockClientWithBikeConfig);

        expect(productOffers.length).toEqual(4);
        expect(productOffers[0].name).toEqual("Fahrrad-Komplettschutz mit monatlicher Zahlweise");
        expect(productOffers[1].name).toEqual("Fahrrad-Komplettschutz mit jährlicher Zahlweise");
        expect(productOffers[2].name).toEqual("E-Bike-Komplettschutz mit monatlicher Zahlweise");
        expect(productOffers[3].name).toEqual("E-Bike-Komplettschutz mit jährlicher Zahlweise");
        expect(productOffers[0].lock).toEqual(client.backends.webservices.productOffersConfigurations[0].lock);
    });

});
