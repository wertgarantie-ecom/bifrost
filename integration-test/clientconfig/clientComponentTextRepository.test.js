const clientComponentTextRepository = require('../../src/clientconfig/clientComponentTextRepository');
const fixtureHelper = require('../helper/fixtureHelper');
const components = require('../../src/components/components').components;

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
        const persistResult = await clientComponentTextRepository.persist(selectionPopUpTexts, client.id, components.selectionPopUp.name);
        expect(persistResult).toEqual(selectionPopUpTexts);
    });

    test("should find selection popup texts for client", async () => {
        const result = await clientComponentTextRepository.findByClientIdAndComponent(client.id, components.selectionPopUp.name);
        expect(result).toEqual(selectionPopUpTexts);
    });

    test("should add texts for different component for same client", async () => {
        const confirmationTexts = {
            de: {
                title: "HERZLICHEN GLÜCKWUNSCH, DU HAST DEN BESTEN SCHUTZ FÜR DEINEN EINKAUF AUSGEWÄHLT.\n",
                subtitle: "BITTE BESTÄTIGE NOCH KURZ:",
                shopName: "Handyflash"
            }
        };
        const persistResult = await clientComponentTextRepository.persist(confirmationTexts, client.id, components.confirmation.name);
        expect(persistResult).toEqual(confirmationTexts);
    });

    test("should update already existing component texts", async () => {
        const newSelectionPopupTexts = {
            de: {
                title: "Wird oft mitgenommen",
                subtitle: "Wählen Sie den Schutz, den sie am geilsten finden:",
                shopName: "Handyflash DE"
            }
        }
        const persistResult = await clientComponentTextRepository.persist(newSelectionPopupTexts, client.id, components.selectionPopUp.name);
        expect(persistResult).toEqual(newSelectionPopupTexts);
    });
});