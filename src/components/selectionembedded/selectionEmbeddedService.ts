import {PaymentIntervalCode} from "../../backends/webservices/webserviceProductOffersRepository";
import {ProductOffer} from "../../productoffers/productOffersService";

const _productOffersService = require("../../productoffers/productOffersService");
const productService = require("../../productoffers/productOfferFormattingService");
const shoppingCartService = require("../../shoppingcart/shoppingCartService");
const _clientComponentTextService = require('../../clientconfig/clientComponentTextService');
const documentTypes = require("../../documents/documentTypes").documentTypes;
const schema = require('../selectionembedded/selectionEmbeddedResponseSchema').selectionEmbeddedResponseSchema;
const component = require('./../components').components.selectionembedded;
const validate = require('../../framework/validation/validator').validate;
const util = require('util');
const metrics = require('../../framework/metrics')();
const _ = require('lodash');

interface SelectionEmbeddedData {
    texts: Map<String, String>,
    products: SelectionEmbeddedProduct[]
}

interface SelectionEmbeddedProduct {
    paymentInterval: string,
    intervalCode: PaymentIntervalCode,
    id: string,
    deviceClass: string,
    shopDeviceClass: string,
    name: string,
    shortName: string,
    top3: string[]
    advantages: string []
    GTCIText: string,
    GTCIUri: string,
    IPIDText: string,
    IPIDUri: string,
    priceFormatted: string,
    price: bigint,
    taxFormatted: string,
    productImageLink: string,
    backgroundStyle: string,
    title: string
}

export async function getProductOffers(shopDeviceClassesString: string, devicePrice: bigint, clientConfig: any, locale: string, shoppingCart: any, userAgent: any, shopProductCondition: string): Promise<SelectionEmbeddedData> {
    const result = await prepareProductSelectionData(shopDeviceClassesString, devicePrice, clientConfig, locale, shoppingCart, shopProductCondition);
    metrics.incrementShowComponentRequest(component.name, result, clientConfig.name, userAgent);
    return result;
}

export async function prepareProductSelectionData(shopDeviceClassesString: string,
                                                  devicePrice: bigint,
                                                  clientConfig: any,
                                                  locale = "de",
                                                  shoppingCart: any,
                                                  shopProductCondition: string,
                                                  productOffersService = _productOffersService,
                                                  clientComponentTextService = _clientComponentTextService): Promise<SelectionEmbeddedData> {
    const shopDeviceClasses = shopDeviceClassesString.split(',');
    const productOffers: ProductOffer[] = await productOffersService.getProductOffers(clientConfig, shopDeviceClasses, devicePrice, undefined, shopProductCondition);
    const products = [];
    const selectionEmbeddedTexts = await clientComponentTextService.getComponentTextsForClientAndLocal(clientConfig.id, component.name, locale);
    products.push(...productOffers.map(offer => convertPayloadToSelectionEmbeddedProduct(offer, productOffers, locale, selectionEmbeddedTexts)));

    const data = {
        texts: selectionEmbeddedTexts,
        products: products
    };
    data.texts.footerHtml = util.format(selectionEmbeddedTexts.footerHtml, selectionEmbeddedTexts.partnerShop);

    const result = validate(data, schema);
    return result.instance;
}

function convertPayloadToSelectionEmbeddedProduct(productOffer: ProductOffer, allProductOffers: ProductOffer[], locale: string, popUpTexts: Map<String, String>): SelectionEmbeddedProduct {
    const displayableProductOffer = productService.fromProductOffer(productOffer, popUpTexts);
    const advantageCategories = displayableProductOffer.getAdvantageCategories(allProductOffers);
    return {
        paymentInterval: displayableProductOffer.getPaymentInterval(),
        intervalCode: productOffer.defaultPaymentInterval,
        id: productOffer.id,
        deviceClass: productOffer.deviceClass,
        shopDeviceClass: productOffer.shopDeviceClass,
        name: productOffer.name,
        shortName: productOffer.shortName,
        top3: advantageCategories.top3,
        advantages: advantageCategories.advantages,
        GTCIText: displayableProductOffer.getDocument(documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE).name,
        GTCIUri: displayableProductOffer.getDocument(documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE).uri,
        IPIDText: displayableProductOffer.getDocument(documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,).name,
        IPIDUri: displayableProductOffer.getDocument(documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION).uri,
        priceFormatted: displayableProductOffer.getPriceFormatted(locale),
        // @ts-ignore
        price: productOffer.prices[productOffer.defaultPaymentInterval].netAmount,
        taxFormatted: displayableProductOffer.getIncludedTaxFormatted(locale),
        productImageLink: productOffer.productImageLink,
        backgroundStyle: productOffer.backgroundStyle,
        title: productOffer.title
    }
}

export async function removeProductFromShoppingCart(orderId: string, shoppingCart: any, clientName: string, productOffersService = _productOffersService) {
    if (!shoppingCart) {
        return undefined;
    }
    const orderIndexToBeDeleted = _.findIndex(shoppingCart.orders, (order: any) => order.id === orderId);
    const tags = [
        `client:${clientName}`,
        `product:${shoppingCart.orders[orderIndexToBeDeleted].wertgarantieProduct.name}`
    ];
    metrics.increment('bifrost.shoppingcart.orders.remove', 1, tags);
    shoppingCart.orders.splice(orderIndexToBeDeleted, 1);
    const result = shoppingCart.orders.length > 0 ? shoppingCart : undefined;
    if (result && result.confirmations.requiredLockPrice) {
        await shoppingCartService.updateLockPrices(result, productOffersService);
    }
    return result;
}

