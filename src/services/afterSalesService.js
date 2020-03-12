const defaultCheckoutRepository = require('../repositories/CheckoutRepository');

exports.prepareAfterSalesData = async function prepareAfterSalesData(sessionId, checkoutRepository = defaultCheckoutRepository) {
    const checkoutData = await checkoutRepository.findBySessionId(sessionId);
    if (!checkoutData) {
        return undefined;
    }

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
};

exports.checkout = async function checkout(shoppingCart, webshopData) {
/*
    Validieren der Shop Data gegen Schema (S-Cart)
    Dekodieren und validieren (Schema + Signatur) des Wertgarantie Shopping Carts (W-Cart)
    Mapping von ClientID (aus W-Cart) auf Secret (Secret ist in DB)
    Validieren das gespeichertes Secret gleich ist mit gesendetem Shop Secret
    Checkout wie bisher
    Speichern der Checkout Daten
    Cookie löschen
*/

};