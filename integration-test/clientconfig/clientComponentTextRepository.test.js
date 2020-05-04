const clientComponentTextRepository = require('../../src/clientconfig/clientComponentTextRepository');
const fixtureHelper = require('../helper/fixtureHelper');
const componentNames = require('../../src/components/componentNames').componentNames;

describe("should persist and retrieve component texts", () => {
    const selectionPopUpTexts = {
        de: {
            title: "Wird oft dazugebucht",
            subtitle: "Wählen Sie den Schutz, der Ihren Bedürfnissen am besten entspricht:",
            shopName: "Handyflash"
        }
    };
    let client;

    test("should persist texts for selection popup", async () => {
        client = await fixtureHelper.createAndPersistDefaultClientWithWebservicesConfiguration();
        const persistResult = await clientComponentTextRepository.persist(selectionPopUpTexts, client.id, componentNames.selectionPopUp);
        expect(persistResult).toEqual(selectionPopUpTexts);
    });

    test("should find selection popup texts for client", async () => {
        const result = await clientComponentTextRepository.findByClientIdAndComponent(client.id, componentNames.selectionPopUp);
        expect(result).toEqual(selectionPopUpTexts);
    });
});