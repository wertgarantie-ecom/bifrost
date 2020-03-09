const defaultCheckoutRepository = require('../repositories/CheckoutRepository');

exports.prepareAfterSalesData = async function prepareAfterSalesData(sessionId, checkoutRepository = defaultCheckoutRepository) {
    const checkoutData = await checkoutRepository.findBySessionId(sessionId);

    const orderItems = [];
    checkoutData.purchases.map(checkoutItem => {
        orderItems.push({
<<<<<<< HEAD
            insuranceProductTitle: checkoutItem.wertgarantieProductName,
            productTitle: checkoutItem.shopProduct
        });
    });
=======
            insuranceProductTitle: checkoutItem.
            productTitle: checkoutItem.shopproduct
        });
    });
    checkoutData
>>>>>>> 0e77aec34607372e17c8b8f6ff0a2487047af59e

    const afterSalesData = {
        headerTitle: "Ihre Geräte wurden erfolgreich versichert!",
        productBoxTitle: "Folgende Geräte wurden versichert:",
        nextStepsTitle: "Die nächsten Schritte:",
<<<<<<< HEAD
        nextSteps: ["Sie erhalten eine E-Mail mit Informationen zum weiteren Vorgehen", "Bitte aktivieren Sie nach Erhalt ihres Produktes die Versicherung mit unserer Fraud-Protection App."],
        orderItems: orderItems
    }


    return afterSalesData;
=======
        nextSteps: [],
        orderItems: []
    }
>>>>>>> 0e77aec34607372e17c8b8f6ff0a2487047af59e
}