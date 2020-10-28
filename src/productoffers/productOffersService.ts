import _webserviceProductOffersRepository from '../backends/webservices/webserviceProductOffersRepository';
import _ from 'lodash';
import condition from "./productConditions";

const {NEW, UNKNOWN} = condition;

export async function getPriceForSelectedProductOffer(clientConfig: any, shopDeviceClass: string, productId: string, shopProductPrice: bigint, paymentInterval: string): Promise<number | undefined> {
    const productOffer = await getProductOfferById(productId);
    if (!productOffer) {
        return undefined;
    } else {
        const preparedProductOffer = webserviceProductOffersToGeneralProductOffers([productOffer], [shopDeviceClass], shopProductPrice);
        const paymentIntervalPrice = preparedProductOffer[0].prices[paymentInterval];
        return (paymentIntervalPrice) ? paymentIntervalPrice.netAmount : undefined;
    }
}

export async function getProductOfferById(productOfferId: string, webserviceProductOffersRepository = _webserviceProductOffersRepository) {
    return webserviceProductOffersRepository.findById(productOfferId);
}

export async function getProductOffers(clientConfig: any, shopDeviceClasses: string[], price: bigint, offerCount: number, shopProductCondition: string, productOffersRepository = _webserviceProductOffersRepository) {
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

export function getCondition(conditionsMapping: any, shopProductCondition: string) {
    if (!shopProductCondition) {
        return NEW;
    }
    let condition = NEW;
    if (conditionsMapping) {
        const mapping = conditionsMapping.find((mapping: any) => mapping.shopCondition === shopProductCondition);
        if (mapping) {
            condition = mapping.bifrostCondition
        } else {
            condition = UNKNOWN;
        }
    }
    return condition;
}


export function filterProductOffers(productOffers: any, deviceClass: string, price: bigint) {
    const filteredProductOffers = _.filter(productOffers, (offer: any) => hasDeviceClassAndIsInLimit(offer, deviceClass, price));
    filteredProductOffers.map((productOffer: any) => {
        productOffer.device = _.find(productOffer.devices, (device: any) => device.objectCodeExternal === deviceClass);
        delete productOffer.devices;
    });
    return filteredProductOffers
}

export function hasDeviceClassAndIsInLimit(productOffer: any, deviceClass: string, price: bigint) {
    return _.find(productOffer.devices, (device: any) => device.objectCodeExternal === deviceClass && device.maxPriceLimitation >= price) !== undefined;
}

export function mapIntervalCode(code: string): string {
    switch (code) {
        case "1":
            return "monthly";
        case "3":
            return "quarterly";
        case "6":
            return "halfYearly";
        case "12":
            return "yearly";
        default:
            throw new Error(`Unknown interval code ${code}`)
    }
}

export function getPricesForWebservicesProductOffer(webservicesProductOffer: any, price: bigint) {
    const intervalPrices: any = {};
    webservicesProductOffer.device.intervals.map((interval: any) => {
        const priceRangePremium = _.find(interval.priceRangePremiums, (priceRangePremium: any) => price >= priceRangePremium.minClose && price < priceRangePremium.maxOpen);
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

export function getMinimumLockPriceForProduct(webservicesProductOffer: any, price: bigint) {
    const lockPriceRange = _.find(webservicesProductOffer.lock.priceRanges, (priceRange: any) => price >= priceRange.minClose && price < priceRange.maxOpen);
    if (!lockPriceRange) {
        return undefined;
    }
    return lockPriceRange.requiredLockPrice;
}

function getPriceRange(webservicesProductOffer: any, price: any) {
    const interval = webservicesProductOffer.device.intervals[0];
    const priceRangePremium = _.find(interval.priceRangePremiums, (priceRangePremium: any) => price >= priceRangePremium.minClose && price < priceRangePremium.maxOpen);
    if (!priceRangePremium) {
        return undefined;
    }
    return {
        minClose: priceRangePremium.minClose,
        maxOpen: priceRangePremium.maxOpen
    }
}

function getProductOfferWithCorrectPrice(webservicesProductOffer: any, price: any) {
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
        documents: webservicesProductOffer.documents.map((document: any) => {
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

export function webserviceProductOffersToGeneralProductOffers(webservicesProductOffers: any, shopDeviceClasses: string[], price: bigint) {
    return shopDeviceClasses.flatMap(shopDeviceClass => {
        const filteredProductOffers = filterProductOffers(webservicesProductOffers, shopDeviceClass, price);
        return filteredProductOffers.map((webservicesProductOffer: any) => {
            return getProductOfferWithCorrectPrice(webservicesProductOffer, price);
        });
    })
}

class ProductOffersError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
