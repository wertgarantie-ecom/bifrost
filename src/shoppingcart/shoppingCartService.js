const uuid = require('uuid');
const _ = require('lodash');
const checkoutRepository = require('./CheckoutRepository');
const _heimdallCheckoutService = require('../backends/heimdall/heimdallCheckoutService');
const webservicesInsuranceProposalService = require('../backends/webservices/webservicesInsuranceProposalService');
const ClientError = require('../errors/ClientError');


exports.addProductToShoppingCartWithOrderId = function addProductToShoppingCartWithOrderId(shoppingCart, requestBody, publicClientId, orderId) {
    requestBody.id = orderId;
    const updatedShoppingCart = shoppingCart || newShoppingCart(publicClientId);
    updatedShoppingCart.orders.push(requestBody);
    updatedShoppingCart.confirmations.termsAndConditionsConfirmed = false;
    updatedShoppingCart.confirmations.legalAgeConfirmed = false;
    return updatedShoppingCart;
};

exports.addProductToShoppingCart = function addProductToShoppingCart(shoppingCart, productToAdd, publicClientId) {
    const orderId = uuid();
    return this.addProductToShoppingCartWithOrderId(shoppingCart, productToAdd, publicClientId, orderId);
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

exports.checkoutShoppingCart = async function checkoutShoppingCart(purchasedShopProducts, customer, shoppingCart, clientConfig, heimdallCheckoutService = _heimdallCheckoutService, idGenerator = uuid, repository = checkoutRepository) {
    const confirmations = shoppingCart.confirmations;
    if (!(confirmations && confirmations.termsAndConditionsConfirmed && confirmations.legalAgeConfirmed)) {
        throw new ClientError("The wertgarantie shopping hasn't been confirmed by the user")
    }

    const purchaseResults = await Promise.all(shoppingCart.orders.map(order => {
        const shopProductIndex = findIndex(purchasedShopProducts, order);
        if (shopProductIndex === -1) {
            return {
                id: idGenerator(),
                wertgarantieProductId: order.wertgarantieProduct.id,
                wertgarantieProductName: order.wertgarantieProduct.name,
                deviceClass: order.shopProduct.deviceClass,
                devicePrice: order.shopProduct.price,
                success: false,
                message: "couldn't find matching product in shop cart for wertgarantie product",
                shopProduct: order.shopProduct.model,
                availableShopProducts: purchasedShopProducts || []
            };
        }
        const matchingShopProduct = purchasedShopProducts.splice(shopProductIndex, 1)[0];
        if (process.env.BACKEND === 'webservices') {
            return webservicesInsuranceProposalService.submitInsuranceProposal(order, customer, matchingShopProduct, clientConfig);
        } else {
            return heimdallCheckoutService.checkout(clientConfig, order, customer, matchingShopProduct);
        }
    }));


    const checkoutData = {
        sessionId: shoppingCart.sessionId,
        traceId: "563e6720-5f07-42ad-99c3-a5104797f083",
        clientId: clientConfig.id,
        purchases: [...purchaseResults]
    };

    await repository.persist(checkoutData);

    return checkoutData;
};

function findIndex(shopSubmittedPurchases, wertgarantieShoppingCartOrder) {
    const wertgarantieSubmittedPurchase = wertgarantieShoppingCartOrder.shopProduct;
    return _.findIndex(shopSubmittedPurchases, shopSubmittedPurchase =>
        shopSubmittedPurchase.model === wertgarantieSubmittedPurchase.model
        && shopSubmittedPurchase.price === wertgarantieSubmittedPurchase.price
        && shopSubmittedPurchase.deviceClass === wertgarantieSubmittedPurchase.deviceClass);
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
        if (shoppingCart.orders[i].id === orderId) {
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
