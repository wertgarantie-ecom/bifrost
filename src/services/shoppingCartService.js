const Joi = require('joi');
const uuid = require('uuid');
const _ = require('lodash');
const axios = require('axios');
const moment = require('moment');

const productSchema = Joi.object({
    productId: Joi.number().integer().required(),
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

exports.checkoutShoppingCart = async function checkoutShoppingCart(shopCart, wertgarantieCart, client = axios, date = new Date()) {
    const result = {
        purchases: []
    };
    if (!wertgarantieCart.confirmed) {
        result.purchases.push({
            success: false,
            message: "Insurance proposal was not transmitted. Purchase was not confirmed by the user."
        })
        return result;
    }
    const shopCartProducts = shopCart.purchasedProducts;
    const wertgarantieProduct = wertgarantieCart.products[0];

    const indexToSplice = findIndex(shopCartProducts, wertgarantieProduct);

    if (indexToSplice === -1) {
        result.purchases.push({
            wertgarantieProductId: wertgarantieProduct.wertgarantieProductId,
            shopProductId: wertgarantieProduct.shopProductId,
            success: false,
            message: "couldn't find matching product in shop cart"
        })
        return result;
    } 
    const matchingShopProduct = shopCartProducts.splice(indexToSplice, 1)[0];
    const requestBody = prepareHeimdallCheckoutData(wertgarantieProduct, shopCart, matchingShopProduct, date);
    try {
        const response = await sendWertgarantieProductCheckout(client, requestBody);
        const responseBody = await JSON.parse(response.body);
        const purchase = {
            wertgarantieProductId: wertgarantieProduct.wertgarantieProductId,
            shopProductId: wertgarantieProduct.shopProductId,
            success: true,
            message: "successfully transmitted insurance proposal",
            contract_number: responseBody.payload.contract_number,
            transaction_number: responseBody.payload.transaction_number,
            activation_code: responseBody.payload.activation_code
        };
        result.purchases.push(purchase);
        return result;
    } catch (e) {
        result.purchases.push({
            wertgarantieProductId: wertgarantieProduct.wertgarantieProductId,
            shopProductId: wertgarantieProduct.shopProductId,
            success: false,
            message: "Failed to transmit insurance proposal. Call to Heimdall threw an error"
        })
        return result;
    }
};

function findIndex(shopCartProducts, wertgarantieProduct) {
    const index = _.findIndex(shopCartProducts, shopProduct => shopProduct.productId === wertgarantieProduct.shopProductId 
        && shopProduct.price === wertgarantieProduct.devicePrice 
        && shopProduct.deviceClass === wertgarantieProduct.deviceClass);
    return index;
}

function formateDate(date) {
    return moment(date).format("YYYY-MM-DD");
}

function prepareHeimdallCheckoutData(wertgarantieProduct, shopCart, matchingShopProduct, date) {
    return {
        productId: wertgarantieProduct.wertgarantieProductId,
        customer_company: shopCart.customer.company,
        customer_salutation: shopCart.customer.salutation,
        customer_firstname: shopCart.customer.firstname,
        customer_lastname: shopCart.customer.lastname,
        customer_street: shopCart.customer.street,
        customer_zip: shopCart.customer.zip,
        customer_city: shopCart.customer.city,
        customer_country: shopCart.customer.country,
        customer_email: shopCart.customer.email,
        device_manufacturer: matchingShopProduct.manufacturer,
        device_model: matchingShopProduct.model,
        device_class: matchingShopProduct.deviceClass,
        device_purchase_price: parseFloat(matchingShopProduct.price),
        device_purchase_date: formateDate(date),
        device_condition: 1,
        payment_type: "bank_transfer",
        terms_and_conditions_accepted: true
    }
}

async function sendWertgarantieProductCheckout(client, data) {
    const response = await client({
        method: 'post',
        url: 'url',
        data: data
    });
    return response;
}

function validateShoppingCart(shoppingCart, clientId, isRequired = false) {
    Joi.assert(clientId, Joi.string().guid().required().error(new Error("clientId is required")));
    const schema = isRequired ? cartSchema(clientId).required() : cartSchema(clientId);
    Joi.assert(shoppingCart, schema);
}

function cartSchema(clientId) {
    return Joi.object({
        clientId: Joi.string().guid().valid(clientId).error(new Error("clientId of product and cart must match")).required(),
        products: Joi.array().items(productSchema).required(),
        confirmed: Joi.boolean()
    });
}

function newShoppingCart(clientId) {
    return {
        "clientId": clientId,
        "products": [],
        "confirmed": false
    };
}
