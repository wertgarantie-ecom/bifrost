const _productImageService = require('../../images/productImageService');
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

exports.getProductOffers = async function getProductOffers(shopDeviceClassesString, devicePrice, clientConfig, locale, shoppingCart) {
    const result = await prepareProductSelectionData(shopDeviceClassesString, devicePrice, clientConfig, locale, shoppingCart);
    metrics.incrementShowComponentRequest(component.name, result, clientConfig.name);
    return result;
};

async function prepareProductSelectionData(shopDeviceClassesString,
                                           devicePrice,
                                           clientConfig,
                                           locale = "de",
                                           shoppingCart,
                                           productOffersService = _productOffersService,
                                           productImageService = _productImageService,
                                           clientComponentTextService = _clientComponentTextService) {
    const shopDeviceClasses = shopDeviceClassesString.split(',');
    const productOffers = await productOffersService.getProductOffers(clientConfig, shopDeviceClasses, devicePrice);
    const products = [];
    let imageLinks = [];
    imageLinks = productImageService.getRandomImageLinksForDeviceClass(productOffers[0].shopDeviceClass, productOffers.length);
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

function convertPayloadToSelectionEmbeddedProduct(productOffer, imageLink, allProductOffers, locale, popUpTexts) {
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
        imageLink: imageLink
    }
}

exports.removeProductFromShoppingCart = async function removeProductFromShoppingCart(productId, shoppingCart, clientName, orderItemId, devicePrice, productOffersService = _productOffersService) {
    if (!shoppingCart) {
        return undefined;
    }
    for (var i = 0; i < shoppingCart.orders.length; i++) {
        const order = shoppingCart.orders[i];
        if (order.wertgarantieProduct.id === productId && order.shopProduct.orderItemId === orderItemId && order.shopProduct.price === devicePrice) {
            const tags = [
                `client:${clientName}`,
                `product:${shoppingCart.orders[i].wertgarantieProduct.name}`
            ];
            metrics.increment('bifrost.shoppingcart.orders.remove', 1, tags);
            shoppingCart.orders.splice(i, 1);
            i--;
        }
    }
    const result = shoppingCart.orders.length > 0 ? shoppingCart : undefined;
    if (result && result.confirmations.requiredLockPrice) {
        await shoppingCartService.updateLockPrices(result, productOffersService);
    }
    return result;
};

exports.prepareProductSelectionData = prepareProductSelectionData;

