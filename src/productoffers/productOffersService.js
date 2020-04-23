const _heimdallClient = require('../backends/heimdall/heimdallClient');
const _webserviceProductOffersRepository = require('../backends/webservices/webserviceProductOffersRepository');
const _ = require('lodash');

async function getProductOffers(clientConfig, deviceClass, price, productOffersRepository = _webserviceProductOffersRepository, heimdallClient = _heimdallClient) {
    if (process.env.BACKEND === "webservices") {
        const clientProductOffers = await productOffersRepository.findByClientId(clientConfig.id);
        return {
            generalDocuments: [],
            productOffers: webserviceProductOffersToGeneralProductOffers(clientProductOffers, deviceClass, price)
        };
    } else {
        const heimdallResponse = await heimdallClient.getProductOffers(clientConfig, deviceClass, price);
        return {
            generalDocuments: [],
            productOffers: heimdallProductOffersToGeneralProductOffers(heimdallResponse)
        };
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
                    "price": parseInt(heimdallOffer.prices.monthly.price.replace(",", "")),
                    "priceCurrency": "EUR",
                    "priceTax": parseInt(heimdallOffer.prices.monthly.price_tax.replace(",", ""))
                },
                quarterly: {
                    "price": parseInt(heimdallOffer.prices.quarterly.price.replace(",", "")),
                    "priceCurrency": "EUR",
                    "priceTax": parseInt(heimdallOffer.prices.quarterly.price_tax.replace(",", ""))
                },
                halfYearly: {
                    "price": parseInt(heimdallOffer.prices.half_yearly.price.replace(",", "")),
                    "priceCurrency": "EUR",
                    "priceTax": parseInt(heimdallOffer.prices.half_yearly.price_tax.replace(",", ""))
                },
                yearly: {
                    "price": parseInt(heimdallOffer.prices.yearly.price.replace(",", "")),
                    "priceCurrency": "EUR",
                    "priceTax": parseInt(heimdallOffer.prices.yearly.price_tax.replace(",", ""))
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
            throw new ProductOffersError(`Could not find insurance premium for product offer ${JSON.stringify(webservicesProductOffer, null, 2)} and price ${price}. This should not happen. Some productOffersConfiguration in the client settings must be invalid.`);
        }
        intervalPrices[mapIntervalCode(interval.intervalCode)] = {
            "price": priceRangePremium.insurancePremium,
            "priceCurrency": "EUR",
            "priceTax": Math.round(priceRangePremium.insurancePremium - priceRangePremium.insurancePremium / 1.19)
        };
    });
    return intervalPrices;
}

function webserviceProductOffersToGeneralProductOffers(webservicesProductOffers, deviceClass, price) {
    const filteredProductOffers = filterProductOffers(webservicesProductOffers, deviceClass, price);
    return filteredProductOffers.map(webservicesProductOffer => {
        return {
            id: webservicesProductOffer.id,
            name: webservicesProductOffer.name,
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
exports.heimdallProductOffersToGeneralProductOffers = heimdallProductOffersToGeneralProductOffers;
exports.filterProductOffers = filterProductOffers;
exports.hasDeviceClassAndIsInLimit = hasDeviceClassAndIsInLimit;
exports.mapIntervalDescription = mapIntervalCode;
exports.getPricesForWebservicesProductOffer = getPricesForWebservicesProductOffer;
exports.webserviceProductOffersToGeneralProductOffers = webserviceProductOffersToGeneralProductOffers;