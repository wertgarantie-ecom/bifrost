const request = require('supertest');
const app = require('../../src/app').default;
const fixtureHelper = require('../helper/fixtureHelper');

describe("should persist, retrieve and alter component texts for client", () => {
    let client;
    const initialComponentTexts = {
        title: "Vergessen Sie nicht Ihren Rundumschutz",
        subtitle: "Wählen Sie die Versicherung aus, die Ihnen zusagt",
        footerHtml: "Versicherung ist Vertrauenssache, deshalb setzt %s neben <strong>500.000 zufriedener Kunden</strong> auf die <strong>Wertgarantie</strong>, den <strong>Testsieger in Sachen Sicherheit</strong>",
        partnerShop: "Testshop",
        detailsHeader: "Details",
        furtherInformation: "Weitere Informationen:",
        wertgarantieFurtherInfoHtml: "Mehr zur <a target=\"_blank\" href=\"%s\">Wertgarantie</a>",
        showDetailsText: "Details",
        cancelButtonText: "Nein, danke",
        confirmButtonText: "Versicherung hinzufügen"
    };
    const initialComponentTextsCompleted = {
        title: "Vergessen Sie nicht Ihren Rundumschutz",
        subtitle: "Wählen Sie die Versicherung aus, die Ihnen zusagt",
        footerHtml: "Versicherung ist Vertrauenssache, deshalb setzt %s neben <strong>500.000 zufriedener Kunden</strong> auf die <strong>Wertgarantie</strong>, den <strong>Testsieger in Sachen Sicherheit</strong>",
        partnerShop: "Testshop",
        detailsHeader: "Details",
        furtherInformation: "Weitere Informationen:",
        wertgarantieFurtherInfoHtml: "Mehr zur <a target=\"_blank\" href=\"%s\">Wertgarantie</a>",
        showDetailsText: "Details",
        hideDetailsText: "Details ausblenden",
        cancelButtonText: "Nein, danke",
        confirmButtonText: "Versicherung hinzufügen",
        documents: {
            PIS: "Produktinformationsblatt",
            IPID: "Informationsblatt für Versicherungsprodukte",
            GTCI: "Allgemeine Versicherungsbedingungen",
            GDPR: "Datenschutz",
            ROW: "Widerrufsrecht"
        },
        productTexts: {
            paymentIntervals: {
                monthly: "monatl.",
                quarterly: "vierteljährl.",
                halfYearly: "habljährl.",
                yearly: "jährl."
            },
            taxInformation: "(inkl. %s VerSt**)"
        }
    };

    test("should insert german text for selection popup", async () => {
        client = await fixtureHelper.createAndPersistPhoneClientWithWebservicesConfiguration();
        const result = await request(app).post(`/wertgarantie/clients/${client.id}/component-texts`)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
            .send({
                component: "selectionpopup",
                locale: "de",
                componentTexts: initialComponentTexts
            });
        expect(result.status).toBe(200);
        expect(result.body.newTexts).toEqual(initialComponentTextsCompleted);
    });

    test("should upsert german texts for selection popup", async () => {
        const upsertTexts = {
            title: "Vergessen Sie nicht Ihren Rundumschutz",
            subtitle: "Wählen Sie die Versicherung aus, die Sie am geilsten finden",
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
        expect(result.body.newTexts.subtitle).toEqual(upsertTexts.subtitle);
        expect(result.body.newTexts.hideDetailsText).toEqual("Details ausblenden") // autocompleted through service
    });
});