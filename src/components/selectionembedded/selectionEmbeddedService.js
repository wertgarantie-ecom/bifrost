const _productOffersService = require("../../productoffers/productOffersService");
const productService = require("../../productoffers/productOfferFormattingService");
const shoppingCartService = require("../../shoppingcart/shoppingCartService");
const _clientComponentTextService = require('../../clientconfig/clientComponentTextService');
const documentTypes = require("../../documents/documentTypes").documentTypes;
const schema = require('../selectionembedded/selectionEmbeddedResponseSchema').selectionEmbeddedResponseSchema;
const component = require('./../components').components.selectionembedded;
const validate = require('../../framework/validation/validator').validate;
const util = require('util');
const metrics = require('../../framework/metrics')();
const _ = require('lodash');

exports.getProductOffers = async function getProductOffers(shopDeviceClassesString, devicePrice, clientConfig, locale, shoppingCart, userAgent, shopProductCondition) {
    const result = await prepareProductSelectionData(shopDeviceClassesString, devicePrice, clientConfig, locale, shoppingCart, shopProductCondition);
    metrics.incrementShowComponentRequest(component.name, result, clientConfig.name, userAgent);
    return result;
};

async function prepareProductSelectionData(shopDeviceClassesString,
                                           devicePrice,
                                           clientConfig,
                                           locale = "de",
                                           shoppingCart,
                                           shopProductCondition,
                                           productOffersService = _productOffersService,
                                           clientComponentTextService = _clientComponentTextService) {
    const shopDeviceClasses = shopDeviceClassesString.split(',');
    const productOffers = await productOffersService.getProductOffers(clientConfig, shopDeviceClasses, devicePrice, undefined, shopProductCondition);
    const products = [];
    const selectionEmbeddedTexts = await clientComponentTextService.getComponentTextsForClientAndLocal(clientConfig.id, component.name, locale);
    products.push(...productOffers.map(offer => convertPayloadToSelectionEmbeddedProduct(offer, productOffers, locale, selectionEmbeddedTexts)));

    const data = {
        texts: selectionEmbeddedTexts,
        products: products
    };
    data.texts.footerHtml = util.format(selectionEmbeddedTexts.footerHtml, selectionEmbeddedTexts.partnerShop);

    const result = validate(data, schema);

    return result.instance;
}

function convertPayloadToSelectionEmbeddedProduct(productOffer, allProductOffers, locale, popUpTexts) {
    const displayableProductOffer = productService.fromProductOffer(productOffer, popUpTexts);
    productOffer.payment = displayableProductOffer.getPaymentInterval();

    const advantageCategories = displayableProductOffer.getAdvantageCategories(allProductOffers);
    return {
        paymentInterval: productOffer.payment,
        intervalCode: productOffer.defaultPaymentInterval,
        id: productOffer.id,
        deviceClass: productOffer.deviceClass,
        shopDeviceClass: productOffer.shopDeviceClass,
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
        productImageLink: productOffer.productImageLink,
        backgroundStyle: productOffer.backgroundStyle
    }
}

exports.removeProductFromShoppingCart = async function removeProductFromShoppingCart(orderId, shoppingCart, clientName, productOffersService = _productOffersService) {
    if (!shoppingCart) {
        return undefined;
    }
    const orderIndexToBeDeleted = _.findIndex(shoppingCart.orders, order => order.id === orderId);
    const tags = [
        `client:${clientName}`,
        `product:${shoppingCart.orders[orderIndexToBeDeleted].wertgarantieProduct.name}`
    ];
    metrics.increment('bifrost.shoppingcart.orders.remove', 1, tags);
    shoppingCart.orders.splice(orderIndexToBeDeleted, 1);
    const result = shoppingCart.orders.length > 0 ? shoppingCart : undefined;
    if (result && result.confirmations.requiredLockPrice) {
        await shoppingCartService.updateLockPrices(result, productOffersService);
    }
    return result;
};

exports.prepareProductSelectionData = prepareProductSelectionData;

