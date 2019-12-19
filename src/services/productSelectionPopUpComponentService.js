const productImageService = require('./productImageService');
const heimdallClient = require("./heimdallClient");

exports.convertPayloadToProduct = function convertPayloadToProduct(payload, imageLink, allProductOffers) {
    if (payload.payment === "Monat") {
        payload.payment = "monatl.";
    } else if (payload.payment === "Jahr") {
        payload.payment = "jährl.";
    } else {
        payload.payment = "pro " + payload.payment;
    }

    const advantages = payload.special_advantages.concat(payload.services, payload.advantages);
    const excludedAdvantages = this.getExcludedAdvantages(advantages, allProductOffers);
    const top3 = advantages.splice(0, 3);
    return {
        id: payload.id,
        name: payload.name,
        top3: top3,
        advantages: advantages,
        excludedAdvantages: excludedAdvantages || [],
        infoSheetText: payload.documents[0].document_title,
        infoSheetUri: payload.documents[0].document_link,
        detailsDocText: payload.documents[1].document_title,
        detailsDocUri: payload.documents[1].document_link,
        paymentInterval: payload.payment,
        price: payload.price,
        currency: payload.price_currency,
        priceFormatted: payload.price_formatted,
        tax: payload.price_tax,
        taxFormatted: "(inkl. " + payload.price_tax + payload.price_currency + " VerSt**)",
        imageLink: imageLink
    }
};

exports.getExcludedAdvantages = function getExcludedAdvantages(advantages, allProductOffers) {
    const advantagesSet = new Set(advantages);
    var allAdvantages = [];
    allProductOffers.forEach(payload => {
        allAdvantages = allAdvantages.concat(payload.special_advantages, payload.services, payload.advantages);
    });
    return Array.from(new Set(allAdvantages.filter(adv => !advantagesSet.has(adv))));
};

exports.getProductOffers = async function getProductOffers(deviceClass, devicePrice, clientId, heimdallClient = heimdallClient, imageService = productImageService) {
    let date = new Date();
    const content = await heimdallClient.getProductOffers(clientId, deviceClass, devicePrice);
    const products = [];
    let imageLinks = [];
    imageLinks = imageService.getRandomImageLinksForDeviceClass(deviceClass, content.payload.length);
    content.payload.forEach((payload, idx) => {
        const product = this.convertPayloadToProduct(payload, imageLinks[idx], content.payload);
        products.push(product);
    });
    return products;
};
