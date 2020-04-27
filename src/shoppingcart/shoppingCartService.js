const uuid = require('uuid');
const _ = require('lodash');
const checkoutRepository = require('./CheckoutRepository');
const _heimdallCheckoutService = require('../backends/heimdall/heimdallCheckoutService');
const webservicesInsuranceProposalService = require('../backends/webservices/webservicesInsuranceProposalService');
const clientService = require('../clientconfig/clientService');

function findWertgarantieDeviceClass(clientConfig, shopDeviceClass) {
    return _.find(clientConfig.productOffersConfigurations.deviceClasses, deviceClassConfiguration => deviceClassConfiguration.objectCodeExternal === shopDeviceClass).objectCode;
}

exports.addProductToShoppingCartWithOrderId = function addProductToShoppingCartWithOrderId(shoppingCart, productToAdd, clientConfig, orderId) {
    const wertgarantieDeviceClass = findWertgarantieDeviceClass(clientConfig, productToAdd.shopDeviceClass);
    productToAdd.orderId = orderId;
    const updatedShoppingCart = shoppingCart || newShoppingCart(clientConfig.clientId);
    updatedShoppingCart.products.push({
        shopDeviceClass: productToAdd.deviceClass,
        shopDevicePrice: productToAdd.devicePrice,
        shopDeviceModel: productToAdd.shopProductName,
        wertgarantieDeviceClass: wertgarantieDeviceClass
    });
    updatedShoppingCart.termsAndConditionsConfirmed = false;
    updatedShoppingCart.legalAgeConfirmed = false;
    return updatedShoppingCart;
};

exports.addProductToShoppingCart = function addProductToShoppingCart(shoppingCart, productToAdd, publicClientId) {
    const orderId = uuid();
    const clientConfig = clientService.findClientForPublicClientId(publicClientId);
    return this.addProductToShoppingCartWithOrderId(shoppingCart, productToAdd, clientConfig, orderId);
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

exports.checkoutShoppingCart = async function checkoutShoppingCart(purchasedShopProducts, customer, wertgarantieCart, client, heimdallCheckoutService = _heimdallCheckoutService, idGenerator = uuid, repository = checkoutRepository) {
    if (!(wertgarantieCart.termsAndConditionsConfirmed && wertgarantieCart.legalAgeConfirmed)) {
        throw new UnconfirmedShoppingCartError("The wertgarantie shopping hasn't been confirmed by the user")
    }

    const purchaseResults = await Promise.all(wertgarantieCart.products.map(async wertgarantieProduct => {
        const shopProductIndex = findIndex(purchasedShopProducts, wertgarantieProduct);
        if (shopProductIndex === -1) {
            return {
                id: idGenerator(),
                wertgarantieProductId: wertgarantieProduct.wertgarantieProductId,
                wertgarantieProductName: wertgarantieProduct.wertgarantieProductName,
                wertgarantieDeviceClass: wertgarantieProduct.wertgarantieDeviceClass,
                deviceClass: wertgarantieProduct.deviceClass,
                devicePrice: wertgarantieProduct.devicePrice,
                success: false,
                message: "couldn't find matching product in shop cart for wertgarantie product",
                shopProduct: wertgarantieProduct.shopProductName,
                availableShopProducts: purchasedShopProducts || []
            };
        }
        const matchingShopProduct = purchasedShopProducts.splice(shopProductIndex, 1)[0];
        const purchaseResult = {
            id: idGenerator(),
            wertgarantieProductId: wertgarantieProduct.wertgarantieProductId,
            wertgarantieProductName: wertgarantieProduct.wertgarantieProductName,
            wertgarantieDeviceClass: wertgarantieProduct.wertgarantieDeviceClass,
            shopDevicePrice: matchingShopProduct.price,
            shopDeviceClass: matchingShopProduct.deviceClass,
            shopDeviceModel: matchingShopProduct.model,
        };
        try {
            let callResult;
            if (process.env.BACKEND === 'webservices') {
                purchaseResult.backend = "webservices";
                callResult = await webservicesInsuranceProposalService.submitInsuranceProposal(wertgarantieProduct, customer, matchingShopProduct, client);
            } else {
                purchaseResult.backend = "heimdall";
                callResult = await heimdallCheckoutService.checkout(client, wertgarantieProduct, customer, matchingShopProduct);
            }
            purchaseResult.success = callResult.success;
            purchaseResult.message = callResult.message;
            purchaseResult.resultCode = callResult.resultCode;
            purchaseResult.contractNumber = callResult.contractnumber;
            purchaseResult.transactionNumber = callResult.transactionNumber;
        } catch (e) {
            purchaseResult.success = false;
            purchaseResult.message = e.message;
            console.error(e);
        }
        return purchaseResult;
    }));


    const checkoutData = {
        sessionId: wertgarantieCart.sessionId,
        traceId: "563e6720-5f07-42ad-99c3-a5104797f083",
        clientId: wertgarantieCart.clientId,
        purchases: [...purchaseResults]
    };

    return await repository.persist(checkoutData);
};

function findIndex(shopCartProducts, wertgarantieProduct) {
    return _.findIndex(shopCartProducts, shopProduct => shopProduct.model === wertgarantieProduct.shopProductName
        && shopProduct.price === wertgarantieProduct.devicePrice
        && shopProduct.deviceClass === wertgarantieProduct.deviceClass);
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
