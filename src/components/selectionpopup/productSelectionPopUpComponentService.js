const _productImageService = require('../../images/productImageService');
const _productOffersService = require("../../productoffers/productOffersService");
const productService = require("../../productoffers/productOfferFormattingService");
const documentTypes = require("../../documents/documentTypes").documentTypes;
const schema = require('./productSelectionResponseSchema').productSelectionResponseSchema;
const _clientComponentTextService = require('../../clientconfig/clientComponentTextService');
const component = require('./../components').components.selectionpopup;
const validate = require('../../framework/validation/validator').validate;
const util = require('util');
const _ = require('lodash');

exports.prepareProductSelectionData = async function prepareProductSelectionData(deviceClass,
                                                                                 devicePrice,
                                                                                 clientConfig,
                                                                                 locale = "de",
                                                                                 orderItemId,
                                                                                 shoppingCart,
                                                                                 productOffersService = _productOffersService,
                                                                                 productImageService = _productImageService,
                                                                                 clientComponentTextService = _clientComponentTextService) {
    if (orderItemId && shoppingCart && shoppingCart.orders && _.find(shoppingCart.orders, order => order.shopProduct.orderItemId === orderItemId)) {
        return undefined;
    }

    const productOffersData = await productOffersService.getProductOffers(clientConfig, deviceClass, devicePrice);
    const productOffers = productOffersData.productOffers;
    const products = [];
    let imageLinks = [];
    imageLinks = productImageService.getRandomImageLinksForDeviceClass(deviceClass, productOffers.length);
    const popUpTexts = await clientComponentTextService.getComponentTextsForClientAndLocal(clientConfig.id, component.name, locale);
    productOffers.forEach((offer, idx) => {
        const product = convertPayloadToSelectionPopUpProduct(offer, imageLinks[idx], productOffers, locale, popUpTexts);
        products.push(product);
    });

    this.products = products;

    const data = {
        texts: popUpTexts,
        products: products
    };
    data.texts.footerHtml = util.format(popUpTexts.footerHtml, popUpTexts.partnerShop);

    return validate(data, schema);
};

function convertPayloadToSelectionPopUpProduct(productOffer, imageLink, allProductOffers, locale, popUpTexts) {
    const displayableProductOffer = productService.fromProductOffer(productOffer, popUpTexts);
    productOffer.payment = displayableProductOffer.getPaymentInterval();

    const advantageCategories = displayableProductOffer.getAdvantageCategories(allProductOffers);
    return {
        paymentInterval: productOffer.payment,
        id: productOffer.id,
        name: productOffer.name,
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

