const defaultCheckoutRepository = require('../repositories/CheckoutRepository');
const signatureService = require('./signatureService');
const ClientError = require('../errors/ClientError');
const shoppingCartService = require('./shoppingCartService');
const clientService = require('./clientService');

function getAfterSalesDataForCheckoutData(checkoutData) {
    const orderItems = [];
    checkoutData.purchases.map(checkoutItem => {
        orderItems.push({
            insuranceProductTitle: checkoutItem.wertgarantieProductName,
            productTitle: checkoutItem.shopProduct
        });
    });

    return {
        headerTitle: "Ihre Geräte wurden erfolgreich versichert!",
        productBoxTitle: "Folgende Geräte wurden versichert:",
        nextStepsTitle: "Die nächsten Schritte:",
        nextSteps: ["Sie erhalten eine E-Mail mit Informationen zum weiteren Vorgehen", "Bitte aktivieren Sie nach Erhalt ihres Produktes die Versicherung mit unserer Fraud-Protection App."],
        orderItems: orderItems
    };
}

exports.prepareAfterSalesData = async function prepareAfterSalesData(sessionId, checkoutRepository = defaultCheckoutRepository) {
    const checkoutData = await checkoutRepository.findBySessionId(sessionId);
    if (!checkoutData) {
        return undefined;
    }

    return getAfterSalesDataForCheckoutData(checkoutData);
};

exports.checkout = async function checkout(shoppingCart, webshopData) {
    const clientData = await clientService.findClientForPublicClientId(shoppingCart.clientId);
    const sessionIdValid = signatureService.verifySessionId(webshopData.encryptedSessionId, clientData, shoppingCart.sessionId);
    if (!sessionIdValid) {
        throw new ClientError("sessionId from shopping cart and webshop do not match! Checkout will not be executed.");
    }

    const checkoutData = await shoppingCartService.checkoutShoppingCart(webshopData.purchasedProducts, webshopData.customer, shoppingCart, clientData);
    return getAfterSalesDataForCheckoutData(checkoutData);
};