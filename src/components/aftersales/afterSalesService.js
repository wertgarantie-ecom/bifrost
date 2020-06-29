const defaultCheckoutRepository = require('../../shoppingcart/checkoutRepository');
const signatureService = require('../../shoppingcart/signatureService');
const ClientError = require('../../errors/ClientError');
const shoppingCartService = require('../../shoppingcart/shoppingCartService');
const _productImageService = require('../../images/productImageService');
const component = require('../components').components.aftersales;
const _clientComponentTextService = require('../../clientconfig/clientComponentTextService');
const metrics = require('../../framework/metrics')();

exports.showAfterSalesComponent = async function showAfterSalesComponent(sessionId, clientName, locale = 'de', checkoutRepository = defaultCheckoutRepository, productImageService = _productImageService, clientComponentTextService = _clientComponentTextService) {
    const checkoutData = await checkoutRepository.findBySessionId(sessionId);
    let result = undefined;
    if (!checkoutData) {
        result = undefined;
    } else {
        result = getAfterSalesDataForCheckoutData(checkoutData, locale, productImageService, clientComponentTextService);
    }
    metrics.incrementShowComponentRequest(component.name, result, clientName);
    return result
};

async function getAfterSalesDataForCheckoutData(checkoutData, locale, productImageService, clientComponentTextService) {
    const successfulOrders = [];
    checkoutData.purchases.filter(purchase => purchase.success).map(checkoutItem => {
        const imageLink = productImageService.getRandomImageLinksForDeviceClass(checkoutItem.shopDeviceClass, 1)[0];
        successfulOrders.push({
            insuranceProductTitle: checkoutItem.wertgarantieProductName,
            productTitle: checkoutItem.shopProduct,
            contractNumber: checkoutItem.contractNumber,
            imageLink: imageLink
        });
    });
    if (successfulOrders.length === 0) {
        return undefined;
    }
    const componentTexts = await clientComponentTextService.getComponentTextsForClientAndLocal(checkoutData.clientId, component.name, locale);
    return {
        texts: componentTexts,
        successfulOrders: successfulOrders,
    };
}

exports.checkoutAndShowAfterSalesComponent = async function checkoutAndShowAfterSalesComponent(shoppingCart, clientConfig, webshopData, locale = 'de', productImageService = _productImageService, clientComponentTextService = _clientComponentTextService) {
    const result = await checkout(shoppingCart, clientConfig, webshopData, locale, productImageService, clientComponentTextService);
    metrics.incrementShowComponentRequest(component.name, result, clientConfig.name);
    return result;
};

async function checkout(shoppingCart, clientConfig, webshopData, locale = 'de', productImageService = _productImageService, clientComponentTextService = _clientComponentTextService) {
    if (!shoppingCart) {
        return undefined;
    }
    const sessionIdValid = signatureService.verifySessionId(webshopData.encryptedSessionId, clientConfig, shoppingCart.sessionId);
    if (!sessionIdValid) {
        throw new ClientError("sessionId from shopping cart and webshop do not match! Checkout will not be executed.");
    }

    const checkoutData = await shoppingCartService.checkoutShoppingCart(webshopData.purchasedProducts, webshopData.customer, webshopData.orderId, shoppingCart, clientConfig);
    return getAfterSalesDataForCheckoutData(checkoutData, locale, productImageService, clientComponentTextService);
}