const request = require('supertest');
const app = require('../../../src/app');
const testhelper = require('../../helper/fixtureHelper');
const nockhelper = require('../../helper/nockHelper');
const components = require('../../../src/components/components').components;
const clientComponentTextService = require('../../../src/clientconfig/clientComponentTextService');

test('should return proper product data', async () => {
    const clientData = await testhelper.createAndPersistDefaultClient();
    const popUpTextsDE = {
        title: "Vergessen Sie nicht Ihren Rundumschutz",
        subtitle: "Wählen Sie die Versicherung aus, die Ihnen zusagt",
        footerText: "Versicherung ist Vertrauenssache, deshalb setzt %s neben 500.000 zufriedener Kunden auf die Wertgarantie, den Testsieger in Sachen Sicherheit, Service und Zufriedenheit.",
        partnerShop: "Testshop"
    };
    await clientComponentTextService.saveNewComponentTextsForClientId(clientData.id, "de", components.selectionpopup.name, popUpTextsDE)
    const signedShoppingCart = testhelper.createSignedShoppingCart({
        publicClientData: clientData.publicClientIds[0],
        deviceClass: "Test",
        devicePrice: 120000
    });

    nockhelper.nockHeimdallLogin(clientData);
    nockhelper.getNockedHeimdallProductOffers(signedShoppingCart, clientData);

    const expectedStatusCode = 200;
    const result = await request(app).get('/wertgarantie/components/selection-popup').set("accept-language", "de").query({
        deviceClass: "Test",
        devicePrice: 120000,
        clientId: clientData.publicClientIds[0],
    });

    expect(result.status).toBe(expectedStatusCode);
    expect(result.body).toEqual({
        "title": "Vergessen Sie nicht Ihren Rundumschutz",
        "subtitle": "Wählen Sie die Versicherung aus, die Ihnen zusagt",
        "products": [
            {
                "id": "1",
                "name": "Basis",
                "top3": [
                    "Für private und berufliche Nutzung",
                    "Unsachgemäße Handhabung",
                    "Weltweiter Schutz"
                ],
                "advantages": [
                    "Volle Kostenübernahme bei Reparaturen",
                    "Bei Totalschaden zählt der Zeitwert",
                    "Für private und berufliche Nutzung",
                    "Weltweiter Schutz",
                    "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte",
                    "Unsachgemäße Handhabung"
                ],
                "excludedAdvantages": [],
                "GTCIText": "Allgemeine Versicherungsbedingungen",
                "GTCIUri": "https://heimdall-stg-04.wertgarantie.com/download/9f1506a9-65e9-467c-a8d0-8f7ccd47d75b",
                "IPIDText": "Informationsblatt für Versicherungsprodukte",
                "IPIDUri": "https://heimdall-stg-04.wertgarantie.com/download/1eb7d0ce-6c62-4264-a3e7-58319bd4d4d1",
                "paymentInterval": "monatl.",
                "priceFormatted": "ab 5,00 €",
                "taxFormatted": "(inkl. 0,80 € VerSt**)",
                "imageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png"
            },
            {
                "id": "2",
                "name": "Premium",
                "top3": [
                    "Für private und berufliche Nutzung",
                    "Unsachgemäße Handhabung",
                    "Weltweiter Schutz"
                ],
                "advantages": [
                    "Volle Kostenübernahme bei Reparaturen",
                    "Bei Totalschaden zählt der Zeitwert",
                    "Für private und berufliche Nutzung",
                    "Weltweiter Schutz",
                    "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte",
                    "Unsachgemäße Handhabung"
                ],
                "excludedAdvantages": [],
                "GTCIText": "Allgemeine Versicherungsbedingungen",
                "GTCIUri": "https://heimdall-stg-04.wertgarantie.com/download/9f1506a9-65e9-467c-a8d0-8f7ccd47d75b",
                "IPIDText": "Informationsblatt für Versicherungsprodukte",
                "IPIDUri": "https://heimdall-stg-04.wertgarantie.com/download/1eb7d0ce-6c62-4264-a3e7-58319bd4d4d1",
                "paymentInterval": "monatl.",
                "priceFormatted": "ab 5,00 €",
                "taxFormatted": "(inkl. 0,80 € VerSt**)",
                "imageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png"
            }
        ],
        "footerText": "Versicherung ist Vertrauenssache, deshalb setzt Testshop neben 500.000 zufriedener Kunden auf die Wertgarantie, den Testsieger in Sachen Sicherheit, Service und Zufriedenheit."
    });
});