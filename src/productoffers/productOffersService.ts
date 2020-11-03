import * as _webserviceProductOffersRepository from '../backends/webservices/webserviceProductOffersRepository';
import {
    PaymentIntervalCode,
    Range,
    SupportedDevice,
    WebservicesProduct
} from '../backends/webservices/webserviceProductOffersRepository';

import _ from 'lodash';
import Condition from "./productConditions";

const {MONTHLY, HALF_YEARLY, QUARTERLY, YEARLY} = PaymentIntervalCode;
const {NEW, UNKNOWN} = Condition;

type WebserviceProductWithFixedDevice = WebservicesProduct & {
    device: SupportedDevice
}

interface Document {
    type: string,
    name: string,
    uri: string
}

interface Price {
    netAmount: number,
    currency: string,
    taxAmount: number
}


export function notUndefined<T>(x: T | undefined): x is T {
    return x !== undefined;
}

interface IntervalPrices {
    MONTHLY: Price
    QUATERLY: Price
    HALF_YEARLY: Price
    YEARLY: Price
}


interface ConditionMapping {
    shopCondition: string,
    bifrostCondition: Condition

}

export async function getProductOffers(clientConfig: any,
                                       shopDeviceClasses: string[],
                                       price: bigint,
                                       offerCount: number,
                                       shopProductCondition: string,
                                       productOffersRepository = _webserviceProductOffersRepository): Promise<ProductOffer[]> {
    let productOffers;
    const clientProductOffers = await productOffersRepository.findByClientId(clientConfig.id);
    productOffers = webserviceProductOffersToGeneralProductOffers(clientProductOffers, shopDeviceClasses, price, shopProductCondition, clientConfig.conditionsMapping);

    if (!offerCount) {
        return productOffers;
    } else {
        return productOffers.length < offerCount ? [] : productOffers.slice(0, offerCount);
    }
}

export async function getPriceForSelectedProductOffer(clientConfig: any, shopDeviceClass: string, productId: string, shopProductPrice: bigint, paymentInterval: PaymentIntervalCode, shopProductCondition: string): Promise<number | undefined> {
    const productOffer = await _webserviceProductOffersRepository.findById(productId);
    if (!productOffer) {
        return undefined;
    } else {
        const preparedProductOffer = webserviceProductOffersToGeneralProductOffers([productOffer], [shopDeviceClass], shopProductPrice, shopProductCondition, clientConfig.conditionsMapping);
        // @ts-ignore
        const paymentIntervalPrice = preparedProductOffer[0].prices[paymentInterval];
        return (paymentIntervalPrice) ? paymentIntervalPrice.netAmount : undefined;
    }
}

export async function getProductOfferById(productOfferId: string, webserviceProductOffersRepository = _webserviceProductOffersRepository): Promise<WebservicesProduct | undefined> {
    return webserviceProductOffersRepository.findById(productOfferId);
}

export function getCondition(conditionsMapping: ConditionMapping[], shopProductCondition: string): Condition {
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

function filterProductOffers(productOffers: ProductOffer[], deviceClass: string, price: bigint): ProductOffer[] {
    const filteredProductOffers = _.filter(productOffers, (offer: any) => hasDeviceClassAndIsInLimit(offer, deviceClass, price));
    filteredProductOffers.map((productOffer: any) => {
        productOffer.device = _.find(productOffer.devices, (device: any) => device.objectCodeExternal === deviceClass);
        delete productOffer.devices;
    });
    return filteredProductOffers
}

function hasDeviceClassAndIsInLimit(productOffer: any, deviceClass: string, price: bigint): boolean {
    return _.find(productOffer.devices, (device: any) => device.objectCodeExternal === deviceClass && device.maxPriceLimitation >= price) !== undefined;
}

export function mapIntervalCode(code: string): PaymentIntervalCode {
    switch (code) {
        case "1":
            return MONTHLY
        case "3":
            return QUARTERLY;
        case "6":
            return HALF_YEARLY;
        case "12":
            return YEARLY;
        default:
            throw new Error(`Unknown interval code ${code}`)
    }
}

function getPricesForWebservicesProductOffer(webservicesProductOffer: any, price: bigint, condition: Condition = Condition.NEW): IntervalPrices {
    const intervalPrices: any = {};
    webservicesProductOffer.device.intervals.map((interval: any) => {
        const priceRangePremium = _.find(interval.priceRangePremiums, (priceRangePremium: any) => price >= priceRangePremium.minClose && price < priceRangePremium.maxOpen && (priceRangePremium.condition || "NEW") === condition);
        if (!priceRangePremium) {
            throw new Error(`Could not find insurance premium for product offer ${JSON.stringify(webservicesProductOffer)} and price ${price}. This should not happen. Some productOffersConfiguration in the client settings must be invalid.`);
        }
        intervalPrices[mapIntervalCode(interval.intervalCode)] = {
            "netAmount": priceRangePremium.insurancePremium,
            "currency": "EUR",
            "taxAmount": Math.round(priceRangePremium.insurancePremium - priceRangePremium.insurancePremium / 1.19)
        };
    });
    return intervalPrices;
}

export function getMinimumLockPriceForProduct(webservicesProductOffer: any, price: bigint): bigint | undefined {
    const lockPriceRange = _.find(webservicesProductOffer.lock.priceRanges, (priceRange: any) => price >= priceRange.minClose && price < priceRange.maxOpen);
    if (!lockPriceRange) {
        return undefined;
    }
    return lockPriceRange.requiredLockPrice;
}

function getPriceRange(webservicesProductOffer: WebserviceProductWithFixedDevice, price: bigint, condition: Condition): Range | undefined {
    const interval = webservicesProductOffer.device.intervals[0];
    const priceRangePremium = _.find(interval.priceRangePremiums,
        (priceRangePremium: any) =>
            price >= priceRangePremium.minClose
            && price < priceRangePremium.maxOpen
            && (priceRangePremium.condition || Condition.NEW) === condition);
    if (!priceRangePremium) {
        return undefined;
    }
    return {
        minClose: priceRangePremium.minClose,
        maxOpen: priceRangePremium.maxOpen
    }
}

export interface ProductOffer {
    id: string,
    name: string,
    shortName: string,
    advantages: string[],
    defaultPaymentInterval: PaymentIntervalCode,
    deviceClass: string,
    shopDeviceClass: string,
    priceRange: Range,
    prices: IntervalPrices,
    documents: Document[],
    backgroundStyle: string,
    productImageLink: string
}

function getProductOfferWithCorrectPrice(webservicesProduct: WebserviceProductWithFixedDevice, price: bigint, condition: Condition): ProductOffer | undefined {
    const priceRange = getPriceRange(webservicesProduct, price, condition);
    if (!priceRange) {
        return undefined;
    }
    return {
        id: webservicesProduct.id,
        name: webservicesProduct.name,
        shortName: webservicesProduct.shortName,
        advantages: [...webservicesProduct.advantages],
        defaultPaymentInterval: webservicesProduct.defaultPaymentInterval,
        deviceClass: webservicesProduct.device.objectCode,
        shopDeviceClass: webservicesProduct.device.objectCodeExternal,
        priceRange,
        prices: getPricesForWebservicesProductOffer(webservicesProduct, price, condition),
        documents: webservicesProduct.documents.map((document: any) => {
            return {
                type: document.documentType,
                name: document.documentTitle,
                uri: `${process.env.BASE_URI}/wertgarantie/documents/${document.documentId}`
            };
        }),
        backgroundStyle: webservicesProduct.backgroundStyle,
        productImageLink: webservicesProduct.productImageLink
    };
}

export function webserviceProductOffersToGeneralProductOffers(webservicesProductOffers: any, shopDeviceClasses: string[], price: bigint, shopProductCondition: string, conditionMapping: ConditionMapping[]): ProductOffer[] {
    const condition = getCondition(conditionMapping, shopProductCondition);
    return shopDeviceClasses.flatMap(shopDeviceClass => {
        const filteredProductOffers = filterProductOffers(webservicesProductOffers, shopDeviceClass, price);
        return filteredProductOffers.map((webservicesProductOffer: any) => {
            return getProductOfferWithCorrectPrice(webservicesProductOffer, price, condition);
        });
    }).filter(notUndefined);
}

