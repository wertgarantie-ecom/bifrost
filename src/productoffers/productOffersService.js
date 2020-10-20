const _webserviceProductOffersRepository = require('../backends/webservices/webserviceProductOffersRepository');
const _ = require('lodash');
const {NEW, UNKNOWN} = require("./productConditions").condition;

async function getPriceForSelectedProductOffer(clientConfig, shopDeviceClass, productId, shopProductPrice, paymentInterval) {
    const productOffer = await getProductOfferById(productId);
    if (!productOffer) {
        return undefined;
    } else {
        const preparedProductOffer = webserviceProductOffersToGeneralProductOffers([productOffer], [shopDeviceClass], shopProductPrice);
        const paymentIntervalPrice = preparedProductOffer[0].prices[paymentInterval];
        return (paymentIntervalPrice) ? paymentIntervalPrice.netAmount : undefined;
    }
}

async function getProductOfferById(productOfferId, webserviceProductOffersRepository = _webserviceProductOffersRepository) {
    return webserviceProductOffersRepository.findById(productOfferId);
}

async function getProductOffers(clientConfig, shopDeviceClasses, price, offerCount, shopProductCondition, productOffersRepository = _webserviceProductOffersRepository) {
    let productOffers;
    if (getCondition(clientConfig.conditionsMapping, shopProductCondition) !== NEW) {
        return [];
    }
    const clientProductOffers = await productOffersRepository.findByClientId(clientConfig.id);
    productOffers = webserviceProductOffersToGeneralProductOffers(clientProductOffers, shopDeviceClasses, price);

    if (!offerCount) {
        return productOffers;
    } else {
        return productOffers.length < offerCount ? [] : productOffers.slice(0, offerCount);
    }
}

function getCondition(conditionsMapping, shopProductCondition) {
    if (!shopProductCondition) {
        return NEW;
    }
    let condition = NEW;
    if (conditionsMapping) {
        const mapping = conditionsMapping.find(mapping => mapping.shopCondition === shopProductCondition);
        if (mapping) {
            condition = mapping.bifrostCondition
        } else {
            condition = UNKNOWN;
        }
    }
    return condition;
}


function filterProductOffers(productOffers, deviceClass, price) {
    const filteredProductOffers = _.filter(productOffers, offer => hasDeviceClassAndIsInLimit(offer, deviceClass, price));
    filteredProductOffers.map(productOffer => {
        productOffer.device = _.find(productOffer.devices, device => device.objectCodeExternal === deviceClass);
        delete productOffer.devices;
    });
    return filteredProductOffers
}

function hasDeviceClassAndIsInLimit(productOffer, deviceClass, price) {
    return _.find(productOffer.devices, device => device.objectCodeExternal === deviceClass && device.maxPriceLimitation >= price) !== undefined;
}

function mapIntervalCode(code) {
    switch (code) {
        case "1":
            return "monthly";
        case "3":
            return "quarterly";
        case "6":
            return "halfYearly";
        case "12":
            return "yearly";
    }
}

function getPricesForWebservicesProductOffer(webservicesProductOffer, price) {
    const intervalPrices = {};
    webservicesProductOffer.device.intervals.map(interval => {
        const priceRangePremium = _.find(interval.priceRangePremiums, priceRangePremium => price >= priceRangePremium.minClose && price < priceRangePremium.maxOpen);
        if (!priceRangePremium) {
            throw new ProductOffersError(`Could not find insurance premium for product offer ${JSON.stringify(webservicesProductOffer)} and price ${price}. This should not happen. Some productOffersConfiguration in the client settings must be invalid.`);
        }
        intervalPrices[mapIntervalCode(interval.intervalCode)] = {
            "netAmount": priceRangePremium.insurancePremium,
            "currency": "EUR",
            "taxAmount": Math.round(priceRangePremium.insurancePremium - priceRangePremium.insurancePremium / 1.19)
        };
    });
    return intervalPrices;
}

function getMinimumLockPriceForProduct(webservicesProductOffer, price) {
    const lockPriceRange = _.find(webservicesProductOffer.lock.priceRanges, priceRange => price >= priceRange.minClose && price < priceRange.maxOpen);
    if (!lockPriceRange) {
        return undefined;
    }
    return lockPriceRange.requiredLockPrice;
}

function getPriceRange(webservicesProductOffer, price) {
    const interval = webservicesProductOffer.device.intervals[0];
    const priceRangePremium = _.find(interval.priceRangePremiums, priceRangePremium => price >= priceRangePremium.minClose && price < priceRangePremium.maxOpen);
    if (!priceRangePremium) {
        return undefined;
    }
    return {
        minClose: priceRangePremium.minClose,
        maxOpen: priceRangePremium.maxOpen
    }
}

function getProductOfferWithCorrectPrice(webservicesProductOffer, price) {
    return {
        id: webservicesProductOffer.id,
        name: webservicesProductOffer.name,
        shortName: webservicesProductOffer.shortName,
        advantages: [...webservicesProductOffer.advantages],
        defaultPaymentInterval: webservicesProductOffer.defaultPaymentInterval,
        deviceClass: webservicesProductOffer.device.objectCode,
        shopDeviceClass: webservicesProductOffer.device.objectCodeExternal,
        priceRange: getPriceRange(webservicesProductOffer, price),
        prices: getPricesForWebservicesProductOffer(webservicesProductOffer, price),
        documents: webservicesProductOffer.documents.map(document => {
            return {
                type: document.documentType,
                name: document.documentTitle,
                uri: `${process.env.BASE_URI}/wertgarantie/documents/${document.documentId}`
            };
        }),
        backgroundStyle: webservicesProductOffer.backgroundStyle,
        productImageLink: webservicesProductOffer.productImageLink
    }
}

function webserviceProductOffersToGeneralProductOffers(webservicesProductOffers, shopDeviceClasses, price) {
    return shopDeviceClasses.flatMap(shopDeviceClass => {
        const filteredProductOffers = filterProductOffers(webservicesProductOffers, shopDeviceClass, price);
        return filteredProductOffers.map(webservicesProductOffer => {
            return getProductOfferWithCorrectPrice(webservicesProductOffer, price);
        });
    })
}

class ProductOffersError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

exports.getProductOffers = getProductOffers;
exports.getProductOfferById = getProductOfferById;
exports.getMinimumLockPriceForProduct = getMinimumLockPriceForProduct;
exports.filterProductOffers = filterProductOffers;
exports.hasDeviceClassAndIsInLimit = hasDeviceClassAndIsInLimit;
exports.mapIntervalDescription = mapIntervalCode;
exports.getPricesForWebservicesProductOffer = getPricesForWebservicesProductOffer;
exports.webserviceProductOffersToGeneralProductOffers = webserviceProductOffersToGeneralProductOffers;
exports.getPriceForSelectedProductOffer = getPriceForSelectedProductOffer;
exports.getCondition = getCondition;
