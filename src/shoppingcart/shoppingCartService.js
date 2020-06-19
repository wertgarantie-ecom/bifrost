const uuid = require('uuid');
const _ = require('lodash');
const checkoutRepository = require('./checkoutRepository');
const _heimdallCheckoutService = require('../backends/heimdall/heimdallCheckoutService');
const webservicesInsuranceProposalService = require('../backends/webservices/webservicesInsuranceProposalService');
const ClientError = require('../errors/ClientError');
const mailSender = require('../mails/mailSender');
const _productOfferService = require('../productoffers/productOffersService');
const metrics = require('../framework/metrics')();


exports.addProductToShoppingCart = async function addProductToShoppingCart(shoppingCart, productToAdd, clientConfig, orderId = uuid(), productOfferService = _productOfferService) {
    const updatedShoppingCart = shoppingCart || newShoppingCart(clientConfig.publicClientIds[0]);
    const completeProductToAdd = await productOfferService.getProductOfferById(productToAdd.wertgarantieProduct.id);
    updatedShoppingCart.orders.push({
        id: orderId,
        shopProduct: productToAdd.shopProduct,
        wertgarantieProduct: productToAdd.wertgarantieProduct
    });
    updatedShoppingCart.confirmations.termsAndConditionsConfirmed = false;
    if (completeProductToAdd.lock) {
        updatedShoppingCart.confirmations.lockConfirmed = false;
        const newItemsLockPrice = productOfferService.getMinimumLockPriceForProduct(completeProductToAdd, productToAdd.shopProduct.price);
        updatedShoppingCart.confirmations.requiredLockPrice = _.max([updatedShoppingCart.confirmations.requiredLockPrice, newItemsLockPrice]);
    }
    const tags = [
        `client:${clientConfig.name}`,
        `product:${productToAdd.wertgarantieProduct.name}`
    ]
    metrics.increment('bifrost.shoppingcart.orders.add', 1, tags);
    return updatedShoppingCart;
};

exports.confirmAttribute = function confirmAttribute(shoppingCart, confirmationAttribute, clientName) {
    const clone = _.cloneDeep(shoppingCart);
    clone.confirmations[confirmationAttribute] = true;
    const tags = [`client:${clientName}`,
        `attribute:${confirmationAttribute}`];
    metrics.increment(`bifrost.shoppingcart.confirmations.confirm`, 1, tags);
    return clone;
};

exports.unconfirmAttribute = function unconfirmAttribute(shoppingCart, confirmationAttribute, clientName) {
    const clone = _.cloneDeep(shoppingCart);
    clone.confirmations[confirmationAttribute] = false;
    const tags = [`client:${clientName}`,
        `attribute:${confirmationAttribute}`];
    metrics.increment(`bifrost.shoppingcart.confirmations.unconfirm`, 1, tags);
    return clone;
};

exports.checkoutShoppingCart = async function checkoutShoppingCart(purchasedShopProducts, customer, shopOrderId, shoppingCart, clientConfig, heimdallCheckoutService = _heimdallCheckoutService, idGenerator = uuid, repository = checkoutRepository) {
    purchasedShopProducts.map(product => {
        const deviceClasses = product.deviceClass ? [product.deviceClass] : product.deviceClasses.split(',');
        delete product.deviceClass;
        product.deviceClasses = deviceClasses;
    })
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
                deviceClass: order.wertgarantieProduct.deviceClass,
                shopDeviceClass: order.wertgarantieProduct.shopDeviceClass,
                devicePrice: order.shopProduct.price,
                success: false,
                message: "couldn't find matching product in shop cart for wertgarantie product",
                shopProduct: order.shopProduct.name,
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
    metrics.recordSubmitProposalRequest(checkoutData, clientConfig.name);
    return checkoutData;
};


exports.removeProductFromShoppingCart = function removeProductFromShoppingCart(id, shoppingCart, clientName) {
    if (!shoppingCart) {
        return undefined;
    }
    for (var i = 0; i < shoppingCart.orders.length; i++) {
        if (shoppingCart.orders[i].id === id) {
            const tags = [
                `client:${clientName}`,
                `product:${shoppingCart.order[i].wertgarantieProduct.name}`
            ]
            metrics.increment('bifrost.shoppingcart.orders.remove', 1, tags);
            shoppingCart.orders.splice(i, 1);
            i--;
        }
    }
    return shoppingCart.orders.length > 0 ? shoppingCart : undefined;
};

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
        const updatedShoppingCart = {...wertgarantieShoppingCart};
        updatedShoppingCart.orders = newOrders;
        return updatedShoppingCart;
    }

    async function updateLockPrice(updatedShoppingCart, changes) {
        if (!(_.isEmpty(changes.updated) && _.isEmpty(changes.deleted))) {
            const lockPrices = await Promise.all(updatedShoppingCart.orders.map(async order => {
                const productOffer = await productOfferService.getProductOfferById(order.wertgarantieProduct.id);
                if (!productOffer.lock) {
                    return undefined;
                }
                return productOfferService.getMinimumLockPriceForProduct(productOffer, order.shopProduct.price);
            }));

            const newRequiredLockPrice = _.max(lockPrices);
            if (!newRequiredLockPrice && !updatedShoppingCart.confirmations.requiredLockPrice && updatedShoppingCart.confirmations.lockConfirmed !== undefined) {
                delete updatedShoppingCart.confirmations.requiredLockPrice;
                delete updatedShoppingCart.confirmations.lockConfirmed;
            } else {
                if (newRequiredLockPrice !== updatedShoppingCart.confirmations.requiredLockPrice) {
                    updatedShoppingCart.confirmations.requiredLockPrice = newRequiredLockPrice;
                    updatedShoppingCart.confirmations.lockConfirmed = false;
                }
            }
        }
    }

    const syncResultAccumulator = {
        changes: {
            deleted: [],
            updated: []
        },
        orders: []
    };

    const syncOrderReducer = async (result, order) => {
        result = await result;
        const matchingShopOrderItem = _.find(shopShoppingCart, shopPurchase => order.shopProduct.orderItemId === shopPurchase.orderItemId);
        if (!matchingShopOrderItem) {
            result.changes.deleted.push(order.id)
        } else {
            if (matchingShopOrderItem.name === order.shopProduct.name && matchingShopOrderItem.price === order.shopProduct.price) {
                result.orders.push(order);
            } else {
                order.shopProduct.name = matchingShopOrderItem.name;
                let priceUpdated = false;
                if (order.shopProduct.price !== matchingShopOrderItem.price) {
                    const newPrice = await productOfferService.getPriceForSelectedProductOffer(clientConfig, order.wertgarantieProduct.shopDeviceClass, order.wertgarantieProduct.id, matchingShopOrderItem.price, order.wertgarantieProduct.paymentInterval);
                    if (!newPrice) {
                        result.changes.deleted.push(order.id);
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
    const updatedWertgarantieShoppingCart = updateShoppingCart(wertgarantieShoppingCart, syncResultAccumulator.orders);
    await updateLockPrice(updatedWertgarantieShoppingCart, syncResultAccumulator.changes);

    return {
        changes: syncResultAccumulator.changes,
        shoppingCart: updatedWertgarantieShoppingCart
    };
};

function findIndex(shopSubmittedPurchases, wertgarantieShoppingCartOrder) {
    const wertgarantieSubmittedPurchase = wertgarantieShoppingCartOrder.shopProduct;
    const wertgarantieSelectedShopProductDeviceClass = wertgarantieShoppingCartOrder.wertgarantieProduct.shopDeviceClass;
    return _.findIndex(shopSubmittedPurchases, shopSubmittedPurchase =>
        shopSubmittedPurchase.name === wertgarantieSubmittedPurchase.name
        && shopSubmittedPurchase.price === wertgarantieSubmittedPurchase.price
        && shopSubmittedPurchase.deviceClasses.includes(wertgarantieSelectedShopProductDeviceClass));
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

async function updateLockPrices(result, productOffersService = _productOfferService) {
    const lockPrices = await Promise.all(result.orders.map(async order => {
        const productOffer = await productOffersService.getProductOfferById(order.wertgarantieProduct.id);
        if (productOffer.lock) {
            return productOffersService.getMinimumLockPriceForProduct(productOffer, order.shopProduct.price);
        }
        return undefined;
    }));
    const newLockPrice = _.max(lockPrices);
    if (!newLockPrice) {
        delete result.confirmations.lockConfirmed;
        delete result.confirmations.requiredLockPrice;
    } else {
        const currentLockPrice = result.confirmations.requiredLockPrice;
        if (currentLockPrice !== newLockPrice) {
            result.confirmations.requiredLockPrice = newLockPrice;
            result.confirmations.lockConfirmed = false;
        }
    }
}

exports.removeProductFromShoppingCart = async function removeProductFromShoppingCart(id, shoppingCart, productOffersService = _productOfferService) {
    if (!shoppingCart) {
        return undefined;
    }
    for (var i = 0; i < shoppingCart.orders.length; i++) {
        if (shoppingCart.orders[i].id === id) {
            shoppingCart.orders.splice(i, 1);
            i--;
        }
    }
    const result = shoppingCart.orders.length > 0 ? shoppingCart : undefined;
    if (result && result.confirmations.requiredLockPrice) {
        await updateLockPrices(result, productOffersService);
    }
    return result;
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
