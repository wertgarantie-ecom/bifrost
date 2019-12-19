const service = require('../../src/services/productService');
const heimdallTestProducts = require("./heimdallTestProducts").heimdallTestProducts;
const productImageMappingWithTwoEntries = {
    "twoEntries": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/eBike-HP.jpeg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/utah-mountain-biking-bike-biking-71104.jpeg"
    ],
    "empty": []
};

test("should not get the same image when product count is lower or equal to the number of images available for device class", () => {
    const images = service.getRandomImageLinkForDeviceClass(productImageMappingWithTwoEntries, "twoEntries", 2);
    const entries = productImageMappingWithTwoEntries.twoEntries;
    expect(images.sort()).toEqual(entries.sort());
});

test("should contain duplicate images when product count is higher than the number of images available for device class", () => {
    const images = service.getRandomImageLinkForDeviceClass(productImageMappingWithTwoEntries, "twoEntries", 4);
    const entries = [...productImageMappingWithTwoEntries.twoEntries, ...productImageMappingWithTwoEntries.twoEntries];
    expect(images.sort()).toEqual(entries.sort());
});

test("should throw an error when unknown deviceClass is provided", () => {
    function getErrorForUnknownDeviceClass() {
        service.getRandomImageLinkForDeviceClass(productImageMappingWithTwoEntries, "FAIL", 4);
    }

    expect(getErrorForUnknownDeviceClass)
        .toThrowError(/The given device class is unknown/);
});

test("should throw an error when no images are set for given device class", () => {
    function getErrorForDeviceClassWithoutImages() {
        service.getRandomImageLinkForDeviceClass(productImageMappingWithTwoEntries, "empty", 4);
    }

    expect(getErrorForDeviceClassWithoutImages)
        .toThrowError(/There are no images for device class/);
});

test("should return correct diff array", () => {
    const advantages1 = ["advantage1, advantage2, advantage3"];
    const allAdvantages = [
        {
            special_advantages: [],
            services: [],
            advantages: ["advantage1, advantage2, advantage3"],
        },
        {
            special_advantages: ["special_advantage"],
            services: ["service"],
            advantages: ["advantage1, advantage2, advantage3", "advantage4"],
        }
    ];


    const advantagesDiff = service.getExcludedAdvantages(advantages1, allAdvantages);

    expect(advantagesDiff).toContain("special_advantage", "service", "advantage4");
    expect(advantagesDiff).not.toContain("advantage1, advantage2, advantage3");
});


test("should return proper product response", async () => {
    const heimdallMock = {
        get: jest.fn(_ => Promise.resolve({
            data: heimdallTestProducts
        }))
    };
    const result = await service.getProductOffers("1dfd4549-9bdc-4285-9047-e5088272dade", "devicePrice", "clientId", heimdallMock);
    const expectedResult = [{
        advantages: ["Volle Kostenübernahme bei Reparaturen", "Bei Totalschaden zählt der Zeitwert", "Für private und berufliche Nutzung", "Weltweiter Schutz", "Geräte bis 12 Monate nach Kaufdatum gelten als Neugeräte", "Unsachgemäße Handhabung"],
        currency: "€",
        detailsDocText: "Informationsblatt für Versicherungsprodukte",
        detailsDocUri: "https://stage-api.wertgarantie.com/download/1eb7d0ce-6c62-4264-a3e7-58319bd4d4d1",
        excludedAdvantages: ["Cyberschutz bei Missbrauch von Online-Accounts und Zahlungsdaten", "Diebstahlschutz", "Keine Selbstbeteiligung im Schadensfall", "einfacher Diebstahl"],
        id: 1,
        imageLink: "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png",
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
        imageLink: "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Premium.png",
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
    expect(result).toEqual(expectedResult);
});