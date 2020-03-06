const defaultCheckoutRepository = require('../repositories/CheckoutRepository');

exports.prepareAfterSalesData = async function prepareAfterSalesData(sessionId, checkoutRepository = defaultCheckoutRepository) {
    const checkoutData = await checkoutRepository.findBySessionId(sessionId);

    const orderItems = [];
    checkoutData.purchases.map(checkoutItem => {
        orderItems.push({
            insuranceProductTitle: checkoutItem.
            productTitle: checkoutItem.shopproduct
        });
    });
    checkoutData

    const afterSalesData = {
        headerTitle: "Ihre Geräte wurden erfolgreich versichert!",
        productBoxTitle: "Folgende Geräte wurden versichert:",
        nextStepsTitle: "Die nächsten Schritte:",
        nextSteps: [],
        orderItems: []
    }
}