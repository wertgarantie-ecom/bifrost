const uuid = require('uuid');
const Joi = require('joi');
const _ = require('lodash/collection');


function doesNotContain(shoppingCart, productToAdd) {
    return !(_.some(shoppingCart.products, productToAdd));
}

exports.addProductToShoppingCart = function addProductToShoppingCart(existingCart, productToAdd, clientId) {
    Joi.assert(clientId, Joi.string().guid().required().error(new Error("client id is required")));
    Joi.assert(existingCart, cartSchema(clientId));
    Joi.assert(productToAdd, productSchema.required());

    const shoppingCart = existingCart || newShoppingCart(clientId);
    if (doesNotContain(shoppingCart, productToAdd)) {
        shoppingCart.products.push(productToAdd);
    }
    return shoppingCart;
};

const productSchema = Joi.object({
    id: Joi.number().integer().required(),
    class: Joi.string().guid().required(),
    price: Joi.number().required(),
    currency: Joi.string().required()
});


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
