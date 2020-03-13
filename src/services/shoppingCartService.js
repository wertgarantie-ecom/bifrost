const Joi = require('joi');
const uuid = require('uuid');
const _ = require('lodash');
const moment = require('moment');
const signatureService = require('./signatureService');
const checkoutRepository = require('../repositories/CheckoutRepository');
const defaultHeimdallClient = require('../services/heimdallClient');
const defaultClientService = require('../services/clientService');

const productSchema = Joi.object({
    wertgarantieProductId: Joi.number().integer().required(),
    deviceClass: Joi.string().guid().required(),
    devicePrice: Joi.number().required(),
    deviceCurrency: Joi.string().required(),
    shopProductName: Joi.string().required(),
    orderId: Joi.string().guid().required()
});

exports.addProductToShoppingCartWithOrderId = function addProductToShoppingCartWithOrderId(shoppingCart, productToAdd, clientId, orderId) {
    productToAdd.orderId = orderId;
    const updatedShoppingCart = shoppingCart || newShoppingCart(clientId);
    updatedShoppingCart.products.push(productToAdd);
    updatedShoppingCart.termsAndConditionsConfirmed = false;
    updatedShoppingCart.legalAgeConfirmed = false;
    return updatedShoppingCart;
};

exports.addProductToShoppingCart = function addProductToShoppingCart(shoppingCart, productToAdd, clientId) {
    const orderId = uuid();
    return this.addProductToShoppingCartWithOrderId(shoppingCart, productToAdd, clientId, orderId);
};

exports.confirmAttribute = function confirmAttribute(shoppingCart, confirmationAttribute) {
    const clone = _.cloneDeep(shoppingCart);
    clone[confirmationAttribute] = true;
    return clone;
};

exports.unconfirmAttribute = function unconfirmAttribute(shoppingCart, confirmationAttribute) {
    const clone = _.cloneDeep(shoppingCart);
    clone[confirmationAttribute] = false;
    return clone;
};

async function callHeimdallToCheckoutWertgarantieProduct(wertgarantieProduct, customer, matchingShopProduct, date, heimdallClient, idGenerator, client) {
    const requestBody = prepareHeimdallCheckoutData(wertgarantieProduct, customer, matchingShopProduct, date);
    try {
        const responseBody = await heimdallClient.sendWertgarantieProductCheckout(requestBody, client);
        return {
            id: idGenerator(),
            wertgarantieProductId: wertgarantieProduct.wertgarantieProductId,
            wertgarantieProductName: wertgarantieProduct.wertgarantieProductName,
            deviceClass: wertgarantieProduct.deviceClass,
            devicePrice: wertgarantieProduct.devicePrice,
            success: true,
            message: "successfully transmitted insurance proposal",
            shopProduct: wertgarantieProduct.shopProductName,
            contractNumber: responseBody.payload.contract_number,
            transactionNumber: responseBody.payload.transaction_number,
            activationCode: responseBody.payload.activation_code
        };
    } catch (e) {
        return {
            id: idGenerator(),
            wertgarantieProductId: wertgarantieProduct.wertgarantieProductId,
            wertgarantieProductName: wertgarantieProduct.wertgarantieProductName,
            deviceClass: wertgarantieProduct.deviceClass,
            devicePrice: wertgarantieProduct.devicePrice,
            success: false,
            message: e.message,
            shopProduct: wertgarantieProduct.shopProductName
        };
    }
}

exports.checkoutShoppingCart = async function checkoutShoppingCart(purchasedShopProducts, customer, wertgarantieCart, client, heimdallClient = defaultHeimdallClient, idGenerator = uuid, date = new Date(), repository = checkoutRepository, clientService = defaultClientService) {
    if (!(wertgarantieCart.termsAndConditionsConfirmed && wertgarantieCart.legalAgeConfirmed)) {
        throw new UnconfirmedShoppingCartError("The wertgarantie shopping hasn't been confirmed by the user")
    }

    const purchaseResults = await Promise.all(wertgarantieCart.products.map(wertgarantieProduct => {
        const shopProductIndex = findIndex(purchasedShopProducts, wertgarantieProduct);
        if (shopProductIndex === -1) {
            return {
                id: idGenerator(),
                wertgarantieProductId: wertgarantieProduct.wertgarantieProductId,
                wertgarantieProductName: wertgarantieProduct.wertgarantieProductName,
                deviceClass: wertgarantieProduct.deviceClass,
                devicePrice: wertgarantieProduct.devicePrice,
                success: false,
                message: "couldn't find matching product in shop cart for wertgarantie product",
                shopProduct: wertgarantieProduct.shopProductName,
                availableShopProducts: purchasedShopProducts || []
            };
        }
        const matchingShopProduct = purchasedShopProducts.splice(shopProductIndex, 1)[0];
        return callHeimdallToCheckoutWertgarantieProduct(wertgarantieProduct, customer, matchingShopProduct, date, heimdallClient, idGenerator, client);
    }));


    const checkoutData = {
        sessionId: wertgarantieCart.sessionId,
        traceId: "563e6720-5f07-42ad-99c3-a5104797f083",
        clientId: wertgarantieCart.clientId,
        purchases: [...purchaseResults]
    };

    await repository.persist(checkoutData);

    return checkoutData;
};

function findIndex(shopCartProducts, wertgarantieProduct) {
    return _.findIndex(shopCartProducts, shopProduct => shopProduct.model === wertgarantieProduct.shopProductName
        && shopProduct.price === wertgarantieProduct.devicePrice
        && shopProduct.deviceClass === wertgarantieProduct.deviceClass);
}

function formatDate(date) {
    return moment(date).format("YYYY-MM-DD");
}

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

function newShoppingCart(clientId) {
    return {
        "sessionId": uuid(),
        "clientId": clientId,
        "products": [],
        "termsAndConditionsConfirmed": false,
        "legalAgeConfirmed": false
    };
}

exports.removeProductFromShoppingCart = function removeProductFromShoppingCart(orderId, shoppingCart) {
    if (!shoppingCart) {
        return undefined;
    }
    for (var i = 0; i < shoppingCart.products.length; i++) {
        if (shoppingCart.products[i].orderId === orderId) {
            shoppingCart.products.splice(i, 1);
            i--;
        }
    }
    return shoppingCart.products.length > 0 ? shoppingCart : undefined;
};

class InvalidPublicClientIdError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class InvalidWertgarantieCartSignatureError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class UnconfirmedShoppingCartError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

exports.InvalidPublicClientIdError = InvalidPublicClientIdError;
exports.InvalidWertgarantieCartSignatureError = InvalidWertgarantieCartSignatureError;
exports.UnconfirmedShoppingCartError = UnconfirmedShoppingCartError;
