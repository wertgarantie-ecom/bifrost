const clientComponentTextRepository = require('../../src/clientconfig/clientComponentTextRepository');
const fixtureHelper = require('../helper/fixtureHelper');

describe("should persist and retrieve component texts", () => {
    const locale = "de";
    const selectionPopUpTexts = {
        title: "Wird oft dazugebucht",
        subtitle: "Wählen Sie den Schutz, der Ihren Bedürfnissen am besten entspricht:",
        shopName: "Handyflash"
    };
    let client;

    test("should persist texts for selection popup", async () => {
        client = await fixtureHelper.createAndPersistPhoneClientWithWebservicesConfiguration();
        const persistResult = await clientComponentTextRepository.persist(selectionPopUpTexts, client.id, locale, "selectionpopup");
        expect(persistResult).toEqual(selectionPopUpTexts);
    });

    test("should find selection popup texts for client", async () => {
        const result = await clientComponentTextRepository.findByClientIdAndLocaleAndComponent(client.id, locale, "selectionpopup");
        expect(result).toEqual(selectionPopUpTexts);
    });

    test("should add texts for different component for same client", async () => {
        const confirmationTexts = {
            de: {
                title: "HERZLICHEN GLÜCKWUNSCH, DU HAST DEN BESTEN SCHUTZ FÜR DEINEN EINKAUF AUSGEWÄHLT.",
                subtitle: "BITTE BESTÄTIGE NOCH KURZ:",
                shopName: "Handyflash"
            }
        };
        const persistResult = await clientComponentTextRepository.persist(confirmationTexts, client.id, locale, "confirmation");
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
        const persistResult = await clientComponentTextRepository.persist(newSelectionPopupTexts, client.id, locale, "selectionpopup");
        expect(persistResult).toEqual(newSelectionPopupTexts);
    });
});