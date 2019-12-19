const productImageService = require('./productImageService');
const defaultHeimdallClient = require("./heimdallClient");
const productService = require("./productService");

exports.getProductOffers = async function getProductOffers(deviceClass, devicePrice, clientId, heimdallClient = defaultHeimdallClient, imageService = productImageService) {
    const content = await heimdallClient.getProductOffers(clientId, deviceClass, devicePrice);
    const products = [];
    let imageLinks = [];
    imageLinks = imageService.getRandomImageLinksForDeviceClass(deviceClass, content.payload.length);
    content.payload.forEach((payload, idx) => {
        const product = convertPayloadToSelectionPopUpProduct(payload, imageLinks[idx], content.payload);
        products.push(product);
    });
    return products;
};

function convertPayloadToSelectionPopUpProduct(heimdallProductOffer, imageLink, allProductOffers) {
    heimdallProductOffer.payment = productService.getPaymentInterval(heimdallProductOffer);

    const advantageCategories = productService.getAdvantageCategories(heimdallProductOffer, allProductOffers);
    return {
        id: heimdallProductOffer.id,
        name: heimdallProductOffer.name,
        top3: advantageCategories.top3,
        advantages: advantageCategories.advantages,
        excludedAdvantages: advantageCategories.excludedAdvantages || [],
        infoSheetText: heimdallProductOffer.documents[0].document_title,
        infoSheetUri: heimdallProductOffer.documents[0].document_link,
        detailsDocText: heimdallProductOffer.documents[1].document_title,
        detailsDocUri: heimdallProductOffer.documents[1].document_link,
        paymentInterval: heimdallProductOffer.payment,
        price: heimdallProductOffer.price,
        currency: heimdallProductOffer.price_currency,
        priceFormatted: heimdallProductOffer.price_formatted,
        tax: heimdallProductOffer.price_tax,
        taxFormatted: productService.getIncludedTaxFormatted(heimdallProductOffer),
        imageLink: imageLink
    }
}