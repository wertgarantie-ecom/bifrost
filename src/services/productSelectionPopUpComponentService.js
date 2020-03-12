const productImageService = require('./productImageService');
const defaultHeimdallClient = require("./heimdallClient");
const productService = require("./heimdallProductOfferService");
const documentType = require("./heimdallProductOfferService").documentType;
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
    heimdallProductOffer.payment = product.getPaymentInterval()

    const advantageCategories = product.getAdvantageCategories(allProductOffers);
    return {
        id: heimdallProductOffer.id,
        name: heimdallProductOffer.name,
        top3: advantageCategories.top3,
        advantages: advantageCategories.advantages,
        excludedAdvantages: advantageCategories.excludedAdvantages || [],
        infoSheetText: product.getDocument(documentType.LEGAL_NOTICE).title,
        infoSheetUri: product.getDocument(documentType.LEGAL_NOTICE).uri,
        detailsDocText: product.getDocument(documentType.GENERAL_INSURANCE_PRODUCTS_INFORMATION).title,
        detailsDocUri: product.getDocument(documentType.GENERAL_INSURANCE_PRODUCTS_INFORMATION).uri,
        paymentInterval: heimdallProductOffer.payment,
        price: heimdallProductOffer.price,
        currency: heimdallProductOffer.price_currency,
        priceFormatted: heimdallProductOffer.price_formatted,
        tax: heimdallProductOffer.price_tax,
        taxFormatted: product.getIncludedTaxFormatted(),
        imageLink: imageLink
    }
}