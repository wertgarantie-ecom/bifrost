const defaultCheckoutRepository = require('../../shoppingcart/checkoutRepository');
const shoppingCartService = require('../../shoppingcart/shoppingCartService');
const component = require('../components').components.aftersales;
const _clientComponentTextService = require('../../clientconfig/clientComponentTextService');
const metrics = require('../../framework/metrics')();

exports.showAfterSalesComponent = async function showAfterSalesComponent(sessionId, clientName, locale = 'de', userAgent, checkoutRepository = defaultCheckoutRepository, clientComponentTextService = _clientComponentTextService) {
    const checkoutData = await checkoutRepository.findBySessionId(sessionId);
    let result;
    if (!checkoutData) {
        result = undefined;
    } else {
        result = getAfterSalesDataForCheckoutData(checkoutData, locale, clientComponentTextService);
    }
    metrics.incrementShowComponentRequest(component.name, result, clientName, userAgent);
    return result
};

async function getAfterSalesDataForCheckoutData(checkoutData, locale, clientComponentTextService) {
    const successfulOrders = [];
    checkoutData.purchases.filter(purchase => purchase.success).map(checkoutItem => {
        successfulOrders.push({
            insuranceProductTitle: checkoutItem.wertgarantieProductName,
            productTitle: checkoutItem.shopProduct,
            contractNumber: checkoutItem.contractNumber,
            productImageLink: checkoutItem.productImageLink,
            backgroundStyle: checkoutItem.backgroundStyle
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

exports.checkoutAndShowAfterSalesComponent = async function checkoutAndShowAfterSalesComponent(shoppingCart, clientConfig, webshopData, locale = 'de', userAgent, clientComponentTextService = _clientComponentTextService) {
    const result = await checkout(shoppingCart, clientConfig, webshopData, locale, clientComponentTextService);
    metrics.incrementShowComponentRequest(component.name, result, clientConfig.name, userAgent);
    return result;
};

async function checkout(shoppingCart, clientConfig, webshopData, locale = 'de', clientComponentTextService = _clientComponentTextService) {
    const checkoutData = await shoppingCartService.checkoutShoppingCart(webshopData.purchasedProducts, webshopData.customer, webshopData.orderId, shoppingCart, clientConfig, webshopData.encryptedSessionId);
    return checkoutData ? getAfterSalesDataForCheckoutData(checkoutData, locale, clientComponentTextService) : undefined;
}