const service = require('../../src/services/confirmationService');

const expectedProductOffersResult = [{
    advantages: ["Volle Kostenübernahme bei Reparaturen", "Bei Totalschaden zählt der Zeitwert", "Für private und berufliche Nutzung", "Weltweiter Schutz", "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte", "Unsachgemäße Handhabung"],
    currency: "€",
    detailsDocText: "Informationsblatt für Versicherungsprodukte",
    detailsDocUri: "https://stage-api.wertgarantie.com/download/1eb7d0ce-6c62-4264-a3e7-58319bd4d4d1",
    excludedAdvantages: ["Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten", "Diebstahlschutz", "Keine Selbstbeteiligung im Schadensfall", "einfacher Diebstahl"],
    id: 1,
    imageLink: "imageLink1",
    infoSheetText: "Rechtsdokumente",
    infoSheetUri: "https://stage-api.wertgarantie.com/download/82e38762-4440-46a9-a34e-58974a3ddad5",
    name: "Basis",
    paymentInterval: "monatl.",
    price: "5,00",
    priceFormatted: "ab 5,00 €",
    tax: "0,80",
    taxFormatted: "(inkl. 0,80€ VerSt**)",
    top_3: ["Für private und berufliche Nutzung", "Unsachgemäße Handhabung", "Weltweiter Schutz"]
}, {
    advantages: ["einfacher Diebstahl", "Für private und berufliche Nutzung", "Unsachgemäße Handhabung", "Weltweiter Schutz", "Volle Kostenübernahme bei Reparaturen", "Bei Totalschaden zählt der Zeitwert", "Für private und berufliche Nutzung", "Weltweiter Schutz", "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte", "Unsachgemäße Handhabung"],
    currency: "€",
    detailsDocText: "Informationsblatt für Versicherungsprodukte",
    detailsDocUri: "https://stage-api.wertgarantie.com/download/191a36e2-6685-4a3d-beb0-dc0159a90387",
    excludedAdvantages: [],
    id: 4,
    imageLink: "imageLink2",
    infoSheetText: "Rechtsdokumente",
    infoSheetUri: "https://stage-api.wertgarantie.com/download/928e51ef-d92f-4aa4-ba42-61d1e100af2f",
    name: "Premium",
    paymentInterval: "monatl.",
    price: "6,95",
    priceFormatted: "ab 6,95 €",
    tax: "1,11",
    taxFormatted: "(inkl. 1,11€ VerSt**)",
    top_3: ["Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten", "Diebstahlschutz", "Keine Selbstbeteiligung im Schadensfall"]
}];

const productServiceMock = {
    getProductOffers: () => expectedProductOffersResult
};

const testShoppingCart = {
    clientId: "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
    products: [
        {
            wertgarantieProductId: 4,
            shopProductId: "1",
            deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
            devicePrice: "1000",
            shopProductName: "Super Bike",
            orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
        },
        {
            wertgarantieProductId: 1,
            shopProductId: "1",
            deviceClass: "6bdd2d93-45d0-49e1-8a0c-98eb80342222",
            devicePrice: "1000",
            shopProductName: "Super Bike",
            orderId: "18ff0413-bcfd-48f8-b003-04b57762067a"
        }
    ],
    confirmed: true
};

test("should return proper confirmation component data for one product", async () => {
    const confirmationData = await service.prepareConfirmationData("clientId", testShoppingCart, productServiceMock);
    console.log(confirmationData);
});