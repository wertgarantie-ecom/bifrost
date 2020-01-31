const productImageService = require('./productImageService');
const defaultHeimdallClient = require("./heimdallClient");
const productService = require("./heimdallProductOfferService");
const defaultClientService = require('../services/clientService');

exports.getProductOffers = async function getProductOffers(deviceClass,
                                                           devicePrice,
                                                           clientId,
                                                           heimdallClient = defaultHeimdallClient,
                                                           imageService = productImageService,
                                                           clientService = defaultClientService) {
    const client = await clientService.findClientForPublicClientId(clientId);
    const productOffers = await heimdallClient.getProductOffers(client, deviceClass, devicePrice);
    const products = [];
    let imageLinks = [];
    imageLinks = imageService.getRandomImageLinksForDeviceClass(deviceClass, productOffers.length);
    productOffers.forEach((offer, idx) => {
        const product = convertPayloadToSelectionPopUpProduct(offer, imageLinks[idx], productOffers);
        products.push(product);
    });
    return products;
};

function convertPayloadToSelectionPopUpProduct(heimdallProductOffer, imageLink, allProductOffers) {
    const product = productService.fromProductOffer(heimdallProductOffer);
    heimdallProductOffer.payment = product.getPaymentInterval();

    const advantageCategories = product.getAdvantageCategories(allProductOffers);
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
        taxFormatted: product.getIncludedTaxFormatted(),
        imageLink: imageLink
    }
}