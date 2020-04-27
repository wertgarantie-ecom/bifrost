const moment = require('moment');
const uuid = require('uuid');
const _heimdallClient = require('./heimdallClient');

module.exports.checkout = async function checkout(clientConfig, wertgarantieProduct, customer, matchingShopProduct, date = new Date(), heimdallClient = _heimdallClient, idGenerator = uuid) {
    const requestBody = prepareHeimdallCheckoutData(wertgarantieProduct, customer, matchingShopProduct, date);
    const responseBody = await heimdallClient.sendWertgarantieProductCheckout(requestBody, clientConfig);
    return {
        success: true,
        message: "successfully transmitted insurance proposal",
        contractNumber: responseBody.payload.contract_number,
        transactionNumber: responseBody.payload.transaction_number,
        activationCode: responseBody.payload.activation_code
    };
};


function prepareHeimdallCheckoutData(wertgarantieProduct, customer, matchingShopProduct, date) {
    return {
        productId: wertgarantieProduct.wertgarantieProductId,
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
        device_manufacturer: matchingShopProduct.manufacturer,
        device_model: matchingShopProduct.model,
        device_class: matchingShopProduct.deviceClass,
        device_purchase_price: parseFloat(matchingShopProduct.price) / 100,
        device_purchase_date: formatDate(date),
        device_condition: 1,
        device_os: matchingShopProduct.deviceOS,
        payment_method: "jährlich",
        payment_type: "bank_transfer",
        terms_and_conditions_accepted: true
    }
}

function formatDate(date) {
    return moment(date).format("YYYY-MM-DD");
}

