const defaultCheckoutRepository = require('../repositories/CheckoutRepository');

exports.prepareAfterSalesData = async function prepareAfterSalesData(sessionId, checkoutRepository = defaultCheckoutRepository) {
    const checkoutData = await checkoutRepository.findBySessionId(sessionId);

    const orderItems = [];
    checkoutData.purchases.map(checkoutItem => {
        orderItems.push({
            insuranceProductTitle: checkoutItem.wertgarantieProductName,
            productTitle: checkoutItem.shopProduct
        });
    });

    const afterSalesData = {
        headerTitle: "Ihre Geräte wurden erfolgreich versichert!",
        productBoxTitle: "Folgende Geräte wurden versichert:",
        nextStepsTitle: "Die nächsten Schritte:",
        nextSteps: ["Sie erhalten eine E-Mail mit Informationen zum weiteren Vorgehen", "Bitte aktivieren Sie nach Erhalt ihres Produktes die Versicherung mit unserer Fraud-Protection App."],
        orderItems: orderItems
    }

    return afterSalesData;
}