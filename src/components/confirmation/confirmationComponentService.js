const productOfferFormattingService = require('../../productoffers/productOfferFormattingService');
const _productOfferService = require('../../productoffers/productOffersService');
const documentTypes = require('../../documents/documentTypes').documentTypes;
const _productImageService = require('../../images/productImageService');
const defaultClientService = require('../../clientconfig/clientService');
const componentName = "confirmation";
const _clientComponentTextService = require('../../clientconfig/clientComponentTextService');
const _ = require('lodash');

exports.prepareConfirmationData = async function prepareConfirmationData(shoppingCart,
                                                                         locale = 'de',
                                                                         productOfferService = _productOfferService,
                                                                         productImageService = _productImageService,
                                                                         clientService = defaultClientService,
                                                                         clientComponentTextService = _clientComponentTextService) {
    if (!shoppingCart) {
        return undefined;
    }
    const result = {
        termsAndConditionsConfirmed: shoppingCart.confirmations.termsAndConditionsConfirmed,
        headerTitle: "Herzlichen Glückwunsch, Du hast den besten Schutz für Deinen Einkauf ausgewählt.",
        confirmText: "Bitte bestätige noch kurz:",
        orders: [],
        shoppingCart: shoppingCart
    };

    let avbHref;
    const client = await clientService.findClientForPublicClientId(shoppingCart.publicClientId);
    for (var i = 0; i < shoppingCart.orders.length; i++) {
        const order = shoppingCart.orders[i];
        const confirmationProductData = await getConfirmationProductData(order, client, locale, productOfferService, productImageService, clientComponentTextService);
        if (confirmationProductData) {
            result.orders.push(confirmationProductData.product);
            avbHref = confirmationProductData.avbHref;
        }
    }

    result.generalConfirmationText = `Ich akzeptiere die Allgemeinen Versicherungsbedingungen <a href="${avbHref}">(AVB)</a> und die Bestimmungen zum Datenschutz. 
                                    Das gesetzliche Widerrufsrecht, die Produktinformationsblätter und die Vermittler-Erstinformation habe ich 
                                    zur Kenntnis genommen und alle Dokumente heruntergeladen. Mit der Bestätigung der Checkbox erkläre ich mich damit 
                                    einverstanden, dass mir alle vorstehenden Unterlagen an meine E-Mail-Adresse übermittelt werden. Der Übertragung 
                                    meiner Daten an Wertgarantie stimme ich zu. Der Betrag wird separat per Rechnung bezahlt.`;
    result.pleaseConfirmText = `Bitte bestätige die oben stehenden Bedingungen um fortzufahren.`;
    if (result.orders.length <= 0) {
        return undefined;
    }
    return result;
};

async function getConfirmationProductData(order, client, locale, productOfferService = _productOfferService, productImageService = _productImageService, clientComponentTextService = _clientComponentTextService) {
    const productOffers = (await productOfferService.getProductOffers(client, order.shopProduct.deviceClass, order.shopProduct.price)).productOffers;
    const productIndex = _.findIndex(productOffers, productOffer => productOffer.id === order.wertgarantieProduct.id);
    if (productIndex !== -1) {
        const matchingOffer = productOffers[productIndex];
        const componentTexts = await clientComponentTextService.getComponentTextsForClientAndLocal(client.id, componentName, locale);
        const productOfferFormatter = productOfferFormattingService.fromProductOffer(matchingOffer, componentTexts);
        matchingOffer.payment = productOfferFormatter.getPaymentInterval();
        const advantageCategories = productOfferFormatter.getAdvantageCategories(productOffers);
        const IPID = productOfferFormatter.getDocument(documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION);
        return {
            product: {
                paymentInterval: matchingOffer.payment,
                price: productOfferFormatter.getPriceFormatted(),
                includedTax: productOfferFormatter.getIncludedTaxFormatted(),
                productTitle: matchingOffer.name,
                top3: advantageCategories.top3,
                IPIDUri: IPID.uri,
                IPIDText: IPID.name,
                productBackgroundImageLink: productImageService.getRandomImageLinksForDeviceClass(order.shopProduct.deviceClass, 1)[0],
                shopProductShortName: order.shopProduct.model,
                orderId: order.id
            },
            avbHref: productOfferFormatter.getDocument(documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE).uri
        };
    }

    return undefined
}