const _heimdallClient = require('../backends/heimdall/heimdallClient');
const _webserviceProductOffersRepository = require('../backends/webservices/webserviceProductOffersRepository');
const _ = require('lodash');

async function getPriceForSelectedProductOffer(clientConfig, deviceClass, productId, shopProductPrice, paymentInterval) {
    const productOffer = await getProductOfferById(productId);
    if (!productOffer) {
        return undefined;
    } else {
        const preparedProductOffer = webserviceProductOffersToGeneralProductOffers([productOffer], deviceClass, shopProductPrice);
        const paymentIntervalPrice = preparedProductOffer[0].prices[paymentInterval];
        return (paymentIntervalPrice) ? paymentIntervalPrice.netAmount : undefined;
    }
}

async function getProductOfferById(productOfferId, webserviceProductOffersRepository = _webserviceProductOffersRepository) {
    return webserviceProductOffersRepository.findById(productOfferId);
}

async function getProductOffers(clientConfig, deviceClass, price, offerCount, productOffersRepository = _webserviceProductOffersRepository, heimdallClient = _heimdallClient) {
    let productOffers;
    if (process.env.BACKEND === "webservices") {
        const clientProductOffers = await productOffersRepository.findByClientId(clientConfig.id);
        productOffers = webserviceProductOffersToGeneralProductOffers(clientProductOffers, deviceClass, price)
    } else {
        const heimdallResponse = await heimdallClient.getProductOffers(clientConfig, deviceClass, price);
        productOffers = heimdallProductOffersToGeneralProductOffers(heimdallResponse)
    }

    if (!offerCount) {
        return productOffers;
    } else {
        return productOffers.length < offerCount ? undefined : productOffers.slice(0, offerCount);
    }
}

function heimdallProductOffersToGeneralProductOffers(heimdallClientResponse) {
    return heimdallClientResponse.map(heimdallOffer => {
        return {
            id: heimdallOffer.id + "",
            name: heimdallOffer.name,
            advantages: [...heimdallOffer.advantages, ...heimdallOffer.services, ...heimdallOffer.special_advantages],
            defaultPaymentInterval: toDefaultPaymentInterval(heimdallOffer.payment),
            prices: {
                monthly: {
                    "netAmount": parseInt(heimdallOffer.prices.monthly.price.replace(",", "")),
                    "currency": "EUR",
                    "taxAmount": parseInt(heimdallOffer.prices.monthly.price_tax.replace(",", ""))
                },
                quarterly: {
                    "netAmount": parseInt(heimdallOffer.prices.quarterly.price.replace(",", "")),
                    "currency": "EUR",
                    "taxAmount": parseInt(heimdallOffer.prices.quarterly.price_tax.replace(",", ""))
                },
                halfYearly: {
                    "netAmount": parseInt(heimdallOffer.prices.half_yearly.price.replace(",", "")),
                    "currency": "EUR",
                    "taxAmount": parseInt(heimdallOffer.prices.half_yearly.price_tax.replace(",", ""))
                },
                yearly: {
                    "netAmount": parseInt(heimdallOffer.prices.yearly.price.replace(",", "")),
                    "currency": "EUR",
                    "taxAmount": parseInt(heimdallOffer.prices.yearly.price_tax.replace(",", ""))
                }
            },
            documents: heimdallOffer.documents.map(document => {
                return {
                    type: document.document_type,
                    name: document.document_title,
                    uri: document.document_link
                };
            })
        };
    });
}

function toDefaultPaymentInterval(heimdallPaymentInterval) {
    switch (heimdallPaymentInterval) {
        case "Monat":
            return "monthly";
        case "Quartal":
            return "quaterly";
        case "Halbjahr":
            return "halfYearly";
        case "Jahr":
            return "yearly";
    }

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

function getProductOfferWithCorrectPrice(webservicesProductOffer, price) {
    return {
        id: webservicesProductOffer.id,
        name: webservicesProductOffer.name,
        shortName: webservicesProductOffer.shortName,
        advantages: [...webservicesProductOffer.advantages],
        defaultPaymentInterval: webservicesProductOffer.defaultPaymentInterval,
        prices: getPricesForWebservicesProductOffer(webservicesProductOffer, price),
        documents: webservicesProductOffer.documents.map(document => {
            return {
                type: document.documentType,
                name: document.documentTitle,
                uri: `${process.env.BASE_URI}/wertgarantie/documents/${document.documentId}`
            };
        })
    }
}

function webserviceProductOffersToGeneralProductOffers(webservicesProductOffers, deviceClass, price) {
    const filteredProductOffers = filterProductOffers(webservicesProductOffers, deviceClass, price);
    return filteredProductOffers.map(webservicesProductOffer => {
        return getProductOfferWithCorrectPrice(webservicesProductOffer, price);
    });
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
exports.heimdallProductOffersToGeneralProductOffers = heimdallProductOffersToGeneralProductOffers;
exports.filterProductOffers = filterProductOffers;
exports.hasDeviceClassAndIsInLimit = hasDeviceClassAndIsInLimit;
exports.mapIntervalDescription = mapIntervalCode;
exports.getPricesForWebservicesProductOffer = getPricesForWebservicesProductOffer;
exports.webserviceProductOffersToGeneralProductOffers = webserviceProductOffersToGeneralProductOffers;
exports.getPriceForSelectedProductOffer = getPriceForSelectedProductOffer;