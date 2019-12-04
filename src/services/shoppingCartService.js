const Joi = require('joi');
const uuid = require('uuid');
const _ = require('lodash');

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
