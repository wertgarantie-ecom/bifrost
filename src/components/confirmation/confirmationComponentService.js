const productOfferFormattingService = require('../../productoffers/productOfferFormattingService');
const _productOfferService = require('../../productoffers/productOffersService');
const documentTypes = require('../../documents/documentTypes').documentTypes;
const component = require('../components').components.confirmation;
const _clientComponentTextService = require('../../clientconfig/clientComponentTextService');
const confirmationResponseSchema = require('./confirmationResponseSchema').confirmationResponseSchema;
const validator = require('../../framework/validation/validator');
const _ = require('lodash');
const util = require('util');
const _shoppingCartService = require('../../shoppingcart/shoppingCartService');
const metrics = require('../../framework/metrics')();

exports.showConfirmationComponent = async function showConfirmationComponent(wertgarantieShoppingCart,
                                                                             clientConfig,
                                                                             shopShoppingCart,
                                                                             locale = 'de',
                                                                             userAgent) {
    const result = await prepareConfirmationData(wertgarantieShoppingCart, clientConfig, shopShoppingCart, locale);
    metrics.incrementShowComponentRequest(component.name, result, clientConfig.name, userAgent);
    return result;
};

async function prepareConfirmationData(wertgarantieShoppingCart,
                                       clientConfig,
                                       shopShoppingCart,
                                       locale = 'de',
                                       productOfferService = _productOfferService,
                                       clientComponentTextService = _clientComponentTextService,
                                       shoppingCartService = _shoppingCartService) {
    if (!wertgarantieShoppingCart) {
        return undefined;
    }

    const updateResult = await shoppingCartService.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart, clientConfig);
    const updatedWertgarantieShoppingCart = updateResult.shoppingCart;

    const idsOfProductsWithPriceChange = updateResult.changes.updated
        .filter(update => update.wertgarantieProductPriceChanged === true)
        .map(update => update.id);
    const priceOfAtLeastOneProductChanged = idsOfProductsWithPriceChange.length > 0;
    const componentTexts = await clientComponentTextService.getComponentTextsForClientAndLocal(clientConfig.id, component.name, locale);
    const result = {
        texts: {
            boxTitle: componentTexts.boxTitle,
            title: componentTexts.title,
            subtitle: componentTexts.subtitle,
            priceChangedWarning: componentTexts.priceChanged
        },
        confirmations: {
            termsAndConditionsConfirmed: priceOfAtLeastOneProductChanged ? false : updatedWertgarantieShoppingCart.confirmations.termsAndConditionsConfirmed,
            furtherConfirmations: []
        },
        showPriceChangedWarning: priceOfAtLeastOneProductChanged,
        orders: [],
        shoppingCart: updatedWertgarantieShoppingCart
    };

    let avbHref;
    let rowHref;
    let GDPRHref;
    let IPIDHref;

    for (var i = 0; i < updatedWertgarantieShoppingCart.orders.length; i++) {
        const order = updatedWertgarantieShoppingCart.orders[i];
        const confirmationProductData = await getConfirmationProductData(order, clientConfig, locale, productOfferService, componentTexts, idsOfProductsWithPriceChange);
        if (confirmationProductData) {
            result.orders.push(confirmationProductData.product);
            avbHref = confirmationProductData.avbHref;
            rowHref = confirmationProductData.rowHref;
            GDPRHref = confirmationProductData.GDPRHref;
            IPIDHref = confirmationProductData.product.IPIDUri;
        }
    }

    result.confirmations.confirmationTextTermsAndConditions = util.format(componentTexts.confirmationTextTermsAndConditions, avbHref, GDPRHref, rowHref, IPIDHref);
    if (updatedWertgarantieShoppingCart.confirmations.lockConfirmed !== undefined) {
        result.confirmations.furtherConfirmations.push({
            name: "lockConfirmed",
            confirmed: updatedWertgarantieShoppingCart.confirmations.lockConfirmed,
            confirmationText: util.format(componentTexts.confirmationTextLock, productOfferFormattingService.formatPrice(updatedWertgarantieShoppingCart.confirmations.requiredLockPrice))
        });
    }
    result.texts.confirmationPrompt = componentTexts.confirmationPrompt;
    if (result.orders.length <= 0) {
        return undefined;
    }

    return validator.validate(result, confirmationResponseSchema).instance;
}

exports.prepareConfirmationData = prepareConfirmationData;

async function getConfirmationProductData(order, client, locale, productOfferService = _productOfferService, componentTexts, listOfUpdates) {
    const productOffers = (await productOfferService.getProductOffers(client, [order.wertgarantieProduct.shopDeviceClass], order.shopProduct.price));
    const productIndex = _.findIndex(productOffers, productOffer => productOffer.id === order.wertgarantieProduct.id);
    if (productIndex !== -1) {
        const matchingOffer = productOffers[productIndex];
        const productOfferFormatter = productOfferFormattingService.fromProductOffer(matchingOffer, componentTexts);
        matchingOffer.payment = productOfferFormatter.getPaymentInterval();
        const IPID = productOfferFormatter.getDocument(documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION);
        return {
            product: {
                paymentInterval: matchingOffer.payment,
                price: productOfferFormatter.getPriceFormatted(),
                includedTax: productOfferFormatter.getIncludedTaxFormatted(),
                productTitle: matchingOffer.name,
                top3: matchingOffer.advantages.splice(0, 3),
                IPIDUri: IPID.uri,
                IPIDText: IPID.name,
                productImageLink: matchingOffer.productImageLink,
                backgroundStyle: matchingOffer.backgroundStyle,
                shopProductShortName: order.shopProduct.name,
                orderId: order.id,
                updated: listOfUpdates.find(updatedId => updatedId === order.id) !== undefined
            },
            avbHref: productOfferFormatter.getDocument(documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE).uri,
            rowHref: productOfferFormatter.getDocument(documentTypes.RIGHT_OF_WITHDRAWAL).uri,
            GDPRHref: productOfferFormatter.getDocument(documentTypes.GENERAL_DATA_PROTECTION_REGULATION).uri
        };
    }
    return undefined
}

exports.getConfirmationProductData = getConfirmationProductData;