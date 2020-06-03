const productOfferFormattingService = require('../../productoffers/productOfferFormattingService');
const _productOfferService = require('../../productoffers/productOffersService');
const documentTypes = require('../../documents/documentTypes').documentTypes;
const _productImageService = require('../../images/productImageService');
const component = require('../components').components.confirmation;
const _clientComponentTextService = require('../../clientconfig/clientComponentTextService');
const confirmationResponseSchema = require('./confirmationResponseSchema').confirmationResponseSchema;
const validator = require('../../framework/validation/validator');
const _ = require('lodash');
const util = require('util');
const _shoppingCartService = require('../../shoppingcart/shoppingCartService');
const metrics = require('../../framework/metrics')();

exports.prepareConfirmationData = async function prepareConfirmationData(wertgarantieShoppingCart,
                                                                         clientConfig,
                                                                         shopShoppingCart,
                                                                         locale = 'de',
                                                                         productOfferService = _productOfferService,
                                                                         productImageService = _productImageService,
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
        const confirmationProductData = await getConfirmationProductData(order, clientConfig, locale, productOfferService, productImageService, componentTexts, idsOfProductsWithPriceChange);
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

    const validationResult = validator.validate(result, confirmationResponseSchema);
    metrics.increment('requests.confirmation.success', 1, ["client:" + clientConfig.name]);
    return validationResult;
};


async function getConfirmationProductData(order, client, locale, productOfferService = _productOfferService, productImageService = _productImageService, componentTexts, listOfUpdates) {
    const productOffers = (await productOfferService.getProductOffers(client, order.shopProduct.deviceClass, order.shopProduct.price)).productOffers;
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
                productBackgroundImageLink: productImageService.getRandomImageLinksForDeviceClass(order.shopProduct.deviceClass, 1)[0],
                shopProductShortName: order.shopProduct.model,
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