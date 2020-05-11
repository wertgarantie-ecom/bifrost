const productOfferFormattingService = require('../../productoffers/productOfferFormattingService');
const _productOfferService = require('../../productoffers/productOffersService');
const documentTypes = require('../../documents/documentTypes').documentTypes;
const _productImageService = require('../../images/productImageService');
const defaultClientService = require('../../clientconfig/clientService');
const component = require('../components').components.confirmation;
const _clientComponentTextService = require('../../clientconfig/clientComponentTextService');
const confirmationResponseSchema = require('./confirmationResponseSchema').confirmationResponseSchema;
const validator = require('../../framework/validation/validator');
const _ = require('lodash');
const util = require('util');

exports.prepareConfirmationData = async function prepareConfirmationData(shoppingCart,
                                                                         locale = 'de',
                                                                         productOfferService = _productOfferService,
                                                                         productImageService = _productImageService,
                                                                         clientService = defaultClientService,
                                                                         clientComponentTextService = _clientComponentTextService) {
    if (!shoppingCart) {
        return undefined;
    }
    const client = await clientService.findClientForPublicClientId(shoppingCart.publicClientId);
    const componentTexts = await clientComponentTextService.getComponentTextsForClientAndLocal(client.id, component.name, locale);
    const result = {
        texts: {
            boxTitle: componentTexts.boxTitle,
            title: componentTexts.title,
            subtitle: componentTexts.subtitle,
        },
        termsAndConditionsConfirmed: shoppingCart.confirmations.termsAndConditionsConfirmed,
        orders: [],
        shoppingCart: shoppingCart
    };

    let avbHref;
    let rowHref;
    let GDPRHref;
    let IPIDHref;

    for (var i = 0; i < shoppingCart.orders.length; i++) {
        const order = shoppingCart.orders[i];
        const confirmationProductData = await getConfirmationProductData(order, client, locale, productOfferService, productImageService, componentTexts);
        if (confirmationProductData) {
            result.orders.push(confirmationProductData.product);
            avbHref = confirmationProductData.avbHref;
            rowHref = confirmationProductData.rowHref;
            GDPRHref = confirmationProductData.GDPRHref;
            IPIDHref = confirmationProductData.product.IPIDUri;
        }
    }

    result.texts.confirmationTextTermsAndConditions = util.format(componentTexts.confirmationTextTermsAndConditions, avbHref, GDPRHref, rowHref, IPIDHref);
    result.texts.confirmationPrompt = componentTexts.confirmationPrompt;
    if (result.orders.length <= 0) {
        return undefined;
    }
    return validator.validate(result, confirmationResponseSchema);
};

async function getConfirmationProductData(order, client, locale, productOfferService = _productOfferService, productImageService = _productImageService, componentTexts) {
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
                orderId: order.id
            },
            avbHref: productOfferFormatter.getDocument(documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE).uri,
            rowHref: productOfferFormatter.getDocument(documentTypes.RIGHT_OF_WITHDRAWAL).uri,
            GDPRHref: productOfferFormatter.getDocument(documentTypes.GENERAL_DATA_PROTECTION_REGULATION).uri
        };
    }

    return undefined
}