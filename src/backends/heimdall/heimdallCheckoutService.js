const moment = require('moment');
const uuid = require('uuid');
const _heimdallClient = require('./heimdallClient');
const _ = require('lodash');

module.exports.checkout = async function checkout(clientConfig, order, customer, shopSubmittedPurchase, date = new Date(), heimdallClient = _heimdallClient, idGenerator = uuid) {
    const heimdallDeviceClass = _.find(clientConfig.backends.heimdall.deviceClassMappings, mapping => mapping.shopDeviceClass === shopSubmittedPurchase.deviceClass).heimdallDeviceClass;
    const requestBody = prepareHeimdallCheckoutData(order, customer, shopSubmittedPurchase, date, heimdallDeviceClass);
    try {
        const responseBody = await heimdallClient.sendWertgarantieProductCheckout(requestBody, clientConfig);
        return {
            id: idGenerator(),
            wertgarantieProductId: order.wertgarantieProduct.id,
            wertgarantieProductName: order.wertgarantieProduct.name,
            deviceClass: heimdallDeviceClass,
            devicePrice: shopSubmittedPurchase.price,
            success: true,
            message: "successfully transmitted insurance proposal",
            shopProduct: shopSubmittedPurchase.name,
            contractNumber: responseBody.payload.contract_number,
            transactionNumber: responseBody.payload.transaction_number,
            backend: "heimdall",
            backendResponseInfo: {
                activationCode: responseBody.payload.activation_code
            }
        };
    } catch (e) {
        return {
            id: idGenerator(),
            wertgarantieProductId: order.wertgarantieProduct.id,
            wertgarantieProductName: order.wertgarantieProduct.name,
            deviceClass: heimdallDeviceClass,
            devicePrice: shopSubmittedPurchase.price,
            success: false,
            message: e.message,
            shopProduct: shopSubmittedPurchase.name,
            backend: "heimdall"
        };
    }
};


function prepareHeimdallCheckoutData(order, customer, shopSubmittedPurchase, date, heimdallDeviceClass) {
    return {
        productId: parseInt(order.wertgarantieProduct.id),
        customer_company: customer.company,
        customer_salutation: customer.salutation,
        customer_firstname: customer.firstname,
        customer_lastname: customer.lastname,
        customer_street: customer.street,
        customer_zip: customer.zip,
        customer_city: customer.city,
        customer_country: customer.country,
        customer_email: customer.email,
        customer_birthdate: "1911-11-11",
        device_manufacturer: shopSubmittedPurchase.manufacturer,
        device_model: shopSubmittedPurchase.name,
        device_class: heimdallDeviceClass,
        device_purchase_price: parseFloat(shopSubmittedPurchase.price) / 100,
        device_purchase_date: formatDate(date),
        device_condition: 1,
        device_os: shopSubmittedPurchase.deviceOS,
        payment_method: "jährlich",
        payment_type: "bank_transfer",
        terms_and_conditions_accepted: true
    }
}

function formatDate(date) {
    return moment(date).format("YYYY-MM-DD");
}

