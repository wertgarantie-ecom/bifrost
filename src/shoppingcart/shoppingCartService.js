const uuid = require('uuid');
const _ = require('lodash');
const checkoutRepository = require('./CheckoutRepository');
const _heimdallCheckoutService = require('../backends/heimdall/heimdallCheckoutService');
const webservicesInsuranceProposalService = require('../backends/webservices/webservicesInsuranceProposalService');


exports.addProductToShoppingCartWithOrderId = function addProductToShoppingCartWithOrderId(shoppingCart, requestBody, clientId, orderId) {
    requestBody.orderId = orderId;
    const updatedShoppingCart = shoppingCart || newShoppingCart(clientId);
    updatedShoppingCart.orders.push(requestBody);
    updatedShoppingCart.confirmations.termsAndConditionsConfirmed = false;
    updatedShoppingCart.confirmations.legalAgeConfirmed = false;
    return updatedShoppingCart;
};

exports.addProductToShoppingCart = function addProductToShoppingCart(shoppingCart, productToAdd, clientId) {
    const orderId = uuid();
    return this.addProductToShoppingCartWithOrderId(shoppingCart, productToAdd, clientId, orderId);
};

exports.confirmAttribute = function confirmAttribute(shoppingCart, confirmationAttribute) {
    const clone = _.cloneDeep(shoppingCart);
    clone.confirmations[confirmationAttribute] = true;
    return clone;
};

exports.unconfirmAttribute = function unconfirmAttribute(shoppingCart, confirmationAttribute) {
    const clone = _.cloneDeep(shoppingCart);
    clone.confirmations[confirmationAttribute] = false;
    return clone;
};

exports.checkoutShoppingCart = async function checkoutShoppingCart(purchasedShopProducts, customer, wertgarantieCart, client, heimdallCheckoutService = _heimdallCheckoutService, idGenerator = uuid, repository = checkoutRepository) {
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
        if (process.env.BACKEND === 'webservices') {
            return webservicesInsuranceProposalService.submitInsuranceProposal(wertgarantieProduct, customer, matchingShopProduct, client);
        } else {
            return heimdallCheckoutService.checkout(client, wertgarantieProduct, customer, matchingShopProduct);
        }
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

function newShoppingCart(clientId) {
    return {
        "sessionId": uuid(),
        "publicClientId": clientId,
        "orders": [],
        "confirmations": {
            "termsAndConditionsConfirmed": false,
            "legalAgeConfirmed": false
        }
    };
}

exports.removeProductFromShoppingCart = function removeProductFromShoppingCart(orderId, shoppingCart) {
    if (!shoppingCart) {
        return undefined;
    }
    for (var i = 0; i < shoppingCart.orders.length; i++) {
        if (shoppingCart.orders[i].orderId === orderId) {
            shoppingCart.orders.splice(i, 1);
            i--;
        }
    }
    return shoppingCart.orders.length > 0 ? shoppingCart : undefined;
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
