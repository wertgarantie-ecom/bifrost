const Joi = require('joi');
const uuid = require('uuid');
const _ = require('lodash');
const axios = require('axios');
const moment = require('moment');
const signatureService = require('./signatureService');
const AxiosLogger = require('axios-logger');
const checkoutRepository = require('../repositories/CheckoutRepository');

const instance = axios.create();
instance.interceptors.request.use((request) => {
    return AxiosLogger.requestLogger(request, {
        dateFormat: 'HH:MM:ss',
        status: true,
        header: true,
    });
}, (error) => {
    return AxiosLogger.errorLogger(error);
});

instance.interceptors.response.use((response) => {
    return AxiosLogger.responseLogger(response, {
        dateFormat: 'HH:MM:ss',
        status: true,
        header: true,
    });
}, (error) => {
    return AxiosLogger.errorLogger(error);
});

// instance.interceptors.response.use(AxiosLogger.responseLogger, AxiosLogger.errorLogger);

const productSchema = Joi.object({
    wertgarantieProductId: Joi.number().integer().required(),
    deviceClass: Joi.string().guid().required(),
    devicePrice: Joi.number().required(),
    deviceCurrency: Joi.string().required(),
    shopProductName: Joi.string().required(),
    orderId: Joi.string().guid().required()
});

exports.addProductToShoppingCartWithOrderId = function addProductToShoppingCartWithOrderId(existingCart, productToAdd, clientId, orderId) {
    productToAdd.orderId = orderId;
    validateShoppingCart(existingCart, clientId);
    Joi.assert(productToAdd, productSchema.required());

    const shoppingCart = existingCart || newShoppingCart(clientId);
    shoppingCart.products.push(productToAdd);
    shoppingCart.confirmed = false;
    return shoppingCart;
};

exports.addProductToShoppingCart = function addProductToShoppingCart(existingCart, productToAdd, clientId) {
    const orderId = uuid();
    return this.addProductToShoppingCartWithOrderId(existingCart, productToAdd, clientId, orderId);
};

exports.confirmShoppingCart = function confirmShoppingCart(shoppingCart, clientId) {
    validateShoppingCart(shoppingCart, clientId, true);
    const clone = _.cloneDeep(shoppingCart);
    clone.confirmed = true;
    return clone;
};

exports.unconfirmShoppingCart = function unconfirmShoppingCart(shoppingCart, clientId) {
    validateShoppingCart(shoppingCart, clientId, true);
    const clone = _.cloneDeep(shoppingCart);
    clone.confirmed = false;
    return clone;
};

async function callHeimdallToCheckoutWertgarantieProduct(wertgarantieProduct, customer, matchingShopProduct, date, client, idGenerator) {
    const requestBody = prepareHeimdallCheckoutData(wertgarantieProduct, customer, matchingShopProduct, date);
    try {
        const response = await sendWertgarantieProductCheckout(client, requestBody);
        // check Heimdall API ob im Fehlerfall was anderes zurück kommt
        const responseBody = response.data;
        return {
            id: idGenerator(),
            wertgarantieProductId: wertgarantieProduct.wertgarantieProductId,
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
            deviceClass: wertgarantieProduct.deviceClass,
            devicePrice: wertgarantieProduct.devicePrice,
            success: false,
            message: e.response.data,
            shopProduct: wertgarantieProduct.shopProductName
        };
    }
}

const clients = [
    {
        name: "bikeShop",
        secrets: ["bikesecret1"],
        publicClientIds: ["5209d6ea-1a6e-11ea-9f8d-778f0ad9137f"]
    },
    {
        name: "handyShop",
        secrets: ["handysecret1"],
        publicClientIds: ["bikeclientId1"]
    }
];

function findClientForSecret(secret) {
    return _.find(clients, (client) => client.secrets.includes(secret));
}

exports.checkoutShoppingCart = async function checkoutShoppingCart(purchasedShopProducts, customer, wrappedWertgarantieCart, clientSecret, httpClient = instance, idGenerator = uuid, date = new Date(), repository = checkoutRepository) {
    const client = findClientForSecret(clientSecret);
    const wertgarantieCart = wrappedWertgarantieCart.shoppingCart;
    if (!client) {
        throw new InvalidClientSecretError("No client available for given secret: " + clientSecret);
    }
    if (!client.publicClientIds.includes(wertgarantieCart.clientId)) {
        throw new InvalidPublicClientIdError("The client ID of Wertgarantie's shopping cart is invalid: " + wertgarantieCart.clientId);
    }
    if (!signatureService.verifyShoppingCart(wrappedWertgarantieCart)) {
        throw new InvalidWertgarantieCartSignatureError("The signature in Wertgarantie's shopping cart is invalid for the given content!");
    }
    if (!wertgarantieCart.confirmed) {
        throw new UnconfirmedShoppingCartError("The wertgarantie shopping hasn't been confirmed by the user")
    }

    const purchaseResults = await Promise.all(wertgarantieCart.products.map(wertgarantieProduct => {
        const shopProductIndex = findIndex(purchasedShopProducts, wertgarantieProduct);
        if (shopProductIndex === -1) {
            return {
                id: idGenerator(),
                wertgarantieProductId: wertgarantieProduct.wertgarantieProductId,
                deviceClass: wertgarantieProduct.deviceClass,
                devicePrice: wertgarantieProduct.devicePrice,
                success: false,
                message: "couldn't find matching product in shop cart for wertgarantie product",
                shopProduct: wertgarantieProduct.shopProductName,
                availableShopProducts: purchasedShopProducts || []
            };
        }
        const matchingShopProduct = purchasedShopProducts.splice(shopProductIndex, 1)[0];
        return callHeimdallToCheckoutWertgarantieProduct(wertgarantieProduct, customer, matchingShopProduct, date, httpClient, idGenerator);
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
        device_manufacturer: matchingShopProduct.manufacturer,
        device_model: matchingShopProduct.model,
        device_class: matchingShopProduct.deviceClass,
        device_purchase_price: parseFloat(matchingShopProduct.price),
        device_purchase_date: formatDate(date),
        device_condition: 1,
        payment_type: "bank_transfer",
        terms_and_conditions_accepted: true
    }
}

async function sendWertgarantieProductCheckout(client, data) {
    const heimdallCheckoutUrl = process.env.HEIMDALL_URI + "/api/v1/products/" + data.productId + "/checkout";
    return await client({
        method: 'post',
        url: heimdallCheckoutUrl,
        data: data,
        withCredentials: true,
        headers: {
            "Authorization": "12345",
            'Content-Type': 'application/json'
        }
    });
}

function validateShoppingCart(shoppingCart, clientId, isRequired = false) {
    Joi.assert(clientId, Joi.string().guid().required().error(new Error("clientId is required")));
    const schema = isRequired ? cartSchema(clientId).required() : cartSchema(clientId);
    Joi.assert(shoppingCart, schema);
}

function cartSchema(clientId) {
    return Joi.object({
        sessionId: Joi.string().guid(),
        clientId: Joi.string().guid().valid(clientId).error(new Error("clientId of product and cart must match")).required(),
        products: Joi.array().items(productSchema).required(),
        confirmed: Joi.boolean()
    });
}

function newShoppingCart(clientId) {
    return {
        "sessionId": uuid(),
        "clientId": clientId,
        "products": [],
        "confirmed": false
    };
}

exports.removeProductFromShoppingCart = function removeProductFromShoppingCart(orderId, shoppingCart) {
    for (var i = 0; i < shoppingCart.products.length; i++) {
        if (shoppingCart.products[i].orderId === orderId) {
            shoppingCart.products.splice(i, 1);
            i--;
        }
    }
    return shoppingCart;
};

class InvalidClientSecretError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

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

exports.InvalidClientSecretError = InvalidClientSecretError;
exports.InvalidPublicClientIdError = InvalidPublicClientIdError;
exports.InvalidWertgarantieCartSignatureError = InvalidWertgarantieCartSignatureError;
exports.UnconfirmedShoppingCartError = UnconfirmedShoppingCartError;
