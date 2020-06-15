const _productImageService = require('../../images/productImageService');
const _productOffersService = require("../../productoffers/productOffersService");
const productService = require("../../productoffers/productOfferFormattingService");
const _clientComponentTextService = require('../../clientconfig/clientComponentTextService');
const documentTypes = require("../../documents/documentTypes").documentTypes;
const schema = require('../selectionembedded/selectionEmbeddedResponseSchema').selectionEmbeddedResponseSchema;
const component = require('./../components').components.selectionembedded;
const validate = require('../../framework/validation/validator').validate;
const util = require('util');
const metrics = require('../../framework/metrics')();

exports.getProductOffers = async function getProductOffers(deviceClass, devicePrice, clientConfig, locale, shoppingCart) {
    const result = await prepareProductSelectionData(deviceClass, devicePrice, clientConfig, locale, shoppingCart);
    metrics.incrementShowComponentRequest(component.name, result, clientConfig.name);
    return result;
};

async function prepareProductSelectionData(deviceClass,
                                           devicePrice,
                                           clientConfig,
                                           locale = "de",
                                           shoppingCart,
                                           productOffersService = _productOffersService,
                                           productImageService = _productImageService,
                                           clientComponentTextService = _clientComponentTextService) {
    const productOffersData = await productOffersService.getProductOffers(clientConfig, deviceClass, devicePrice);
    const productOffers = productOffersData.productOffers;
    const products = [];
    let imageLinks = [];
    imageLinks = productImageService.getRandomImageLinksForDeviceClass(deviceClass, productOffers.length);
    const selectionEmbeddedTexts = await clientComponentTextService.getComponentTextsForClientAndLocal(clientConfig.id, component.name, locale);
    productOffers.forEach((offer, idx) => {
        const product = convertPayloadToSelectionEmbeddedProduct(offer, imageLinks[idx], productOffers, locale, selectionEmbeddedTexts);
        products.push(product);
    });

    this.products = products;

    const data = {
        texts: selectionEmbeddedTexts,
        products: products
    };
    data.texts.footerHtml = util.format(selectionEmbeddedTexts.footerHtml, selectionEmbeddedTexts.partnerShop);

    const result = validate(data, schema);

    return result.instance;
}

exports.prepareProductSelectionData = prepareProductSelectionData;


function convertPayloadToSelectionEmbeddedProduct(productOffer, imageLink, allProductOffers, locale, popUpTexts) {
    const displayableProductOffer = productService.fromProductOffer(productOffer, popUpTexts);
    productOffer.payment = displayableProductOffer.getPaymentInterval();

    const advantageCategories = displayableProductOffer.getAdvantageCategories(allProductOffers);
    return {
        paymentInterval: productOffer.payment,
        intervalCode: productOffer.defaultPaymentInterval,
        id: productOffer.id,
        name: productOffer.name,
        shortName: productOffer.shortName,
        top3: advantageCategories.top3,
        advantages: advantageCategories.advantages,
        GTCIText: displayableProductOffer.getDocument(documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE).name, // GTCI
        GTCIUri: displayableProductOffer.getDocument(documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE).uri, // GTCI --> naming hier auch ändern infoSheet und detailsDoc is scheiße
        IPIDText: displayableProductOffer.getDocument(documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,).name, // IPID
        IPIDUri: displayableProductOffer.getDocument(documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION).uri, // IPID
        priceFormatted: displayableProductOffer.getPriceFormatted(locale),
        price: productOffer.prices[productOffer.defaultPaymentInterval].netAmount,
        taxFormatted: displayableProductOffer.getIncludedTaxFormatted(locale),
        imageLink: imageLink
    }
}
