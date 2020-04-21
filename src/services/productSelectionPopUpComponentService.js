const productImageService = require('./productImageService');
const _productOffersService = require("./productOffersService");
const productService = require("./productOfferFormattingService");
const documentType = require("./productOfferFormattingService").documentType;
const defaultClientService = require('../services/clientService');
const schema = require('../schemas/productSelectionResponseSchema').productSelectionResponseSchema;
const jsonschema = require('jsonschema');

exports.prepareProductSelectionData = async function prepareProductSelectionData(deviceClass,
                                                                                 devicePrice,
                                                                                 clientId,
                                                                                 productOffersService = _productOffersService,
                                                                                 imageService = productImageService,
                                                                                 clientService = defaultClientService) {
    const client = await clientService.findClientForPublicClientId(clientId);
    const productOffersData = await productOffersService.getProductOffers(client, deviceClass, devicePrice);
    const productOffers = productOffersData.productOffers;
    const products = [];
    let imageLinks = [];
    imageLinks = imageService.getRandomImageLinksForDeviceClass(deviceClass, productOffers.length);
    productOffers.forEach((offer, idx) => {
        const product = convertPayloadToSelectionPopUpProduct(offer, imageLinks[idx], productOffers);
        products.push(product);
    });
    const data = {
        title: "Vergessen Sie nicht Ihren Rundumschutz",
        products: products
    };
    return jsonschema.validate(data, schema);
};

function convertPayloadToSelectionPopUpProduct(productOffer, imageLink, allProductOffers) {
    const product = productService.fromProductOffer(productOffer);
    productOffer.payment = product.getPaymentInterval();

    const advantageCategories = product.getAdvantageCategories(allProductOffers);
    return {
        id: productOffer.id,
        name: productOffer.name,
        top3: advantageCategories.top3,
        advantages: advantageCategories.advantages,
        excludedAdvantages: advantageCategories.excludedAdvantages || [],
        infoSheetText: product.getDocument(documentType.LEGAL_NOTICE).title,
        infoSheetUri: product.getDocument(documentType.LEGAL_NOTICE).uri,
        detailsDocText: product.getDocument(documentType.GENERAL_INSURANCE_PRODUCTS_INFORMATION).title,
        detailsDocUri: product.getDocument(documentType.GENERAL_INSURANCE_PRODUCTS_INFORMATION).uri,
        paymentInterval: productOffer.payment,
        price: productOffer.price,
        currency: productOffer.priceCurrency,
        priceFormatted: productOffer.priceFormatted,
        tax: productOffer.priceTax,
        taxFormatted: product.getIncludedTaxFormatted(),
        imageLink: imageLink
    }
}