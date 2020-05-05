const request = require('supertest');
const app = require('../../src/app');
const fixtureHelper = require('../helper/fixtureHelper');

describe("should persist, retrieve and alter component texts for client", () => {
    let client;
    const initialComponentTexts = {
        title: "Vergessen Sie nicht Ihren Rundumschutz",
        subtitle: "Wählen Sie die Versicherung aus, die Ihnen zusagt",
        footerText: "Versicherung ist Vertrauenssache, deshalb setzt %s neben 500.000 zufriedener Kunden auf die Wertgarantie, den Testsieger in Sachen Sicherheit, Service und Zufriedenheit.",
        partnerShop: "Testshop"
    };

    test("should insert german text for selection popup", async () => {
        client = await fixtureHelper.createAndPersistDefaultClientWithWebservicesConfiguration();
        const result = await request(app).post(`/wertgarantie/clients/${client.id}/component-texts`)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
            .send({
                component: "selectionpopup",
                locale: "de",
                componentTexts: initialComponentTexts
            });
        expect(result.status).toBe(200);
        expect(result.body.newTexts).toEqual(initialComponentTexts);
    });

    test("should upsert german texts for selection popup", async () => {
        const upsertTexts = {
            title: "Vergessen Sie nicht Ihren Rundumschutz",
            subtitle: "Wählen Sie die Versicherung aus, die Ihnen zusagt",
            footerText: "Versicherung ist Vertrauenssache, deshalb setzt %s neben 500.000 zufriedener Kunden auf die Wertgarantie, den Testsieger in Sachen Sicherheit, Service und Zufriedenheit.",
            partnerShop: "Testshop"
        };
        const result = await request(app).post(`/wertgarantie/clients/${client.id}/component-texts`)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
            .send({
                component: "selectionpopup",
                locale: "de",
                componentTexts: upsertTexts
            });
        expect(result.status).toBe(200);
        expect(result.body.newTexts).toEqual(upsertTexts);
    });
});