const productImageService = require('./productImageService');
const _productOffersService = require("./productOffersService");
const productService = require("./productOfferFormattingService");
const documentTypes = require("./documentTypes").documentTypes;
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
        infoSheetText: product.getDocument(documentTypes.LEGAL_NOTICE).name,
        infoSheetUri: product.getDocument(documentTypes.LEGAL_NOTICE).uri,
        detailsDocText: product.getDocument(documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION).name,
        detailsDocUri: product.getDocument(documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION).uri,
        priceFormatted: product.getPriceFormatted(),
        taxFormatted: product.getIncludedTaxFormatted(),
        imageLink: imageLink
    }
}