const Joi = require('joi');
const uuid = require('uuid');

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
    Joi.assert(clientId, Joi.string().guid().required().error(new Error("client id is required")));
    Joi.assert(existingCart, cartSchema(clientId));
    Joi.assert(productToAdd, productSchema.required());

    const shoppingCart = existingCart || newShoppingCart(clientId);
    shoppingCart.products.push(productToAdd);
    return shoppingCart;
};

exports.addProductToShoppingCart = function addProductToShoppingCart(existingCart, productToAdd, clientId) {
    const orderId = uuid();
    return this.addProductToShoppingCartWithOrderId(existingCart, productToAdd, clientId, orderId);
}

function cartSchema(clientId) {
    return Joi.object({
        clientId: Joi.string().guid().valid(clientId).error(new Error("clientId of product and cart must match")).required(),
        products: Joi.array().items(productSchema).required()
    });
}

function newShoppingCart(clientId) {
    return {
        "clientId": clientId,
        "products": []
    };
}
