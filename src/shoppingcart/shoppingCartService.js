const uuid = require('uuid');
const _ = require('lodash');
const checkoutRepository = require('./checkoutRepository');
const _heimdallCheckoutService = require('../backends/heimdall/heimdallCheckoutService');
const webservicesInsuranceProposalService = require('../backends/webservices/webservicesInsuranceProposalService');
const ClientError = require('../errors/ClientError');
const mailSender = require('../mails/mailSender');
const _productOfferService = require('../productoffers/productOffersService');
const metrics = require('../framework/metrics');


exports.addProductToShoppingCart = function addProductToShoppingCart(shoppingCart, productToAdd, publicClientId, orderId = uuid()) {
    const updatedShoppingCart = shoppingCart || newShoppingCart(publicClientId);
    updatedShoppingCart.orders.push({
        id: orderId,
        shopProduct: productToAdd.shopProduct,
        wertgarantieProduct: productToAdd.wertgarantieProduct
    });
    updatedShoppingCart.confirmations.termsAndConditionsConfirmed = false;
    return updatedShoppingCart;
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

exports.checkoutShoppingCart = async function checkoutShoppingCart(purchasedShopProducts, customer, shopOrderId, shoppingCart, clientConfig, heimdallCheckoutService = _heimdallCheckoutService, idGenerator = uuid, repository = checkoutRepository) {
    const confirmations = shoppingCart.confirmations;
    if (!(confirmations && confirmations.termsAndConditionsConfirmed)) {
        throw new ClientError("The wertgarantie shopping hasn't been confirmed by the user");
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
        shopOrderId: shopOrderId,
        traceId: "563e6720-5f07-42ad-99c3-a5104797f083",
        clientId: clientConfig.id,
        test: customer.firstname === 'Otto' && customer.lastname === 'Normalverbraucher',
        purchases: [...purchaseResults]
    };

    await repository.persist(checkoutData);
    mailSender.sendCheckoutMails(clientConfig.name, clientConfig.email, checkoutData.purchases, checkoutData.shopOrderId, customer);
    return checkoutData;
};

function sendCheckoutMetrics(clientId, checkoutData) {
    const tags = [clientId];
    if (checkoutData.test) {
        tags.push('test');

    }
    metrics().increment('proposals.count', checkoutData.purchases.length, tags);
    metrics().increment('proposals.premium.monthly', checkoutData.purchases.wertgarantieProduct.pr);
}

exports.syncShoppingCart = async function updateWertgarantieShoppingCart(wertgarantieShoppingCart, shopShoppingCart, clientConfig, productOfferService = _productOfferService) {
    function resultWitEmptyChanges(wertgarantieShoppingCart) {
        return {
            changes: {
                deleted: [],
                updated: []
            },
            shoppingCart: wertgarantieShoppingCart
        }
    }

    function updateShoppingCart(oldShoppingCart, newOrders) {
        const updatedShoppingCart = {...wertgarantieShoppingCart}
        updatedShoppingCart.orders = newOrders;
        return updatedShoppingCart;
    }

    const syncResultAccumulator = {
        changes: {
            deleted: [],
            updated: []
        },
        orders: []
    }

    const syncOrderReducer = async (result, order) => {
        result = await result;
        const matchingShopOrderItem = _.find(shopShoppingCart, shopPurchase => order.shopProduct.orderItemId === shopPurchase.orderItemId);
        if (!matchingShopOrderItem) {
            result.changes.deleted.push(order.id)
        } else {
            if (matchingShopOrderItem.model === order.shopProduct.model && matchingShopOrderItem.price === order.shopProduct.price) {
                result.orders.push(order);
            } else {
                order.shopProduct.model = matchingShopOrderItem.model;
                let priceUpdated = false;
                if (order.shopProduct.price !== matchingShopOrderItem.price) {
                    const newPrice = await productOfferService.getPriceForSelectedProductOffer(clientConfig, order.shopProduct.deviceClass, order.wertgarantieProduct.id, matchingShopOrderItem.price, order.wertgarantieProduct.paymentInterval);
                    if (!newPrice) {
                        result.changes.deleted.push(order.id)
                        return;
                    }
                    order.shopProduct.price = matchingShopOrderItem.price;
                    priceUpdated = order.wertgarantieProduct.price !== newPrice;
                    order.wertgarantieProduct.price = newPrice;
                }
                result.orders.push(order);
                result.changes.updated.push({
                    id: order.id,
                    wertgarantieProductPriceChanged: priceUpdated
                })
            }
        }
        return result;
    };

    if (!shopShoppingCart) {
        return resultWitEmptyChanges(wertgarantieShoppingCart);
    }
    if (!wertgarantieShoppingCart || _.isEmpty(wertgarantieShoppingCart.orders)) {
        return resultWitEmptyChanges(wertgarantieShoppingCart)
    }
    if (wertgarantieShoppingCart.orders[0].shopProduct.orderItemId === undefined) {
        return resultWitEmptyChanges(wertgarantieShoppingCart)
    }

    await wertgarantieShoppingCart.orders.reduce(syncOrderReducer, syncResultAccumulator);
    const updatedWertgarantieShoppingCart = updateShoppingCart(wertgarantieShoppingCart, syncResultAccumulator.orders)

    return {
        changes: syncResultAccumulator.changes,
        shoppingCart: updatedWertgarantieShoppingCart
    };
}

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
            "termsAndConditionsConfirmed": false
        }
    };
}

exports.removeProductFromShoppingCart = function removeProductFromShoppingCart(id, shoppingCart) {
    if (!shoppingCart) {
        return undefined;
    }
    for (var i = 0; i < shoppingCart.orders.length; i++) {
        if (shoppingCart.orders[i].id === id) {
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
