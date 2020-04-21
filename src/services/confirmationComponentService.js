const productOfferFormattingService = require('./productOfferFormattingService');
const _productOfferService = require('./productOffersService');
const documentTypes = require('./documentTypes').documentTypes;
const defaultProductImageService = require('./productImageService');
const defaultClientService = require('./clientService');
const _ = require('lodash');

exports.prepareConfirmationData = async function prepareConfirmationData(shoppingCart,
                                                                         productOfferService = _productOfferService,
                                                                         productImageService = defaultProductImageService,
                                                                         clientService = defaultClientService) {
    if (!shoppingCart) {
        return undefined;
    }
    const result = {
        termsAndConditionsConfirmed: shoppingCart.termsAndConditionsConfirmed,
        legalAgeConfirmed: shoppingCart.legalAgeConfirmed,
        headerTitle: "Herzlichen Glückwunsch, Du hast den besten Schutz für Deinen Einkauf ausgewählt.",
        confirmText: "Bitte bestätige noch kurz:",
        products: [],
        shoppingCart: shoppingCart
    };

    let avbHref;
    const client = await clientService.findClientForPublicClientId(shoppingCart.clientId);
    for (var i = 0; i < shoppingCart.products.length; i++) {
        const wertgarantieProduct = shoppingCart.products[i];
        const confirmationProductData = await getConfirmationProductData(wertgarantieProduct, client, productOfferService, productImageService);
        if (confirmationProductData) {
            result.products.push(confirmationProductData.product);
            avbHref = confirmationProductData.avbHref;
        }
    }

    result.generalConfirmationText = `Ich akzeptiere die Allgemeinen Versicherungsbedingungen <a href="${avbHref}">(AVB)</a> und die Bestimmungen zum Datenschutz. 
                                    Das gesetzliche Widerrufsrecht, die Produktinformationsblätter und die Vermittler-Erstinformation habe ich 
                                    zur Kenntnis genommen und alle Dokumente heruntergeladen. Mit der Bestätigung der Checkbox erkläre ich mich damit 
                                    einverstanden, dass mir alle vorstehenden Unterlagen an meine E-Mail-Adresse übermittelt werden. Der Übertragung 
                                    meiner Daten an Wertgarantie stimme ich zu. Der Betrag wird separat per Rechnung bezahlt.`;
    result.legalAgeConfirmationText = `Hiermit bestätige ich, dass ich mindestens 18 Jahre alt bin.`;
    result.pleaseConfirmText = `Bitte bestätige die oben stehenden Bedingungen um fortzufahren.`;
    if (result.products.length <= 0) {
        return undefined;
    }
    return result;
};

async function getConfirmationProductData(wertgarantieProduct, client, productOfferService = _productOfferService, productImageService = defaultProductImageService) {
    const productOffers = (await productOfferService.getProductOffers(client, wertgarantieProduct.deviceClass, wertgarantieProduct.devicePrice)).productOffers;
    const productIndex = _.findIndex(productOffers, productOffer => productOffer.id === wertgarantieProduct.wertgarantieProductId);
    if (productIndex !== -1) {
        const matchingOffer = productOffers[productIndex];
        const heimdallProduct = productOfferFormattingService.fromProductOffer(matchingOffer);
        const advantageCategories = heimdallProduct.getAdvantageCategories(productOffers);
        const productInformationSheet = heimdallProduct.getDocument(documentTypes.PRODUCT_INFORMATION_SHEET);
        return {
            product: {
                paymentInterval: heimdallProduct.getPaymentInterval(),
                price: matchingOffer.price_formatted,
                includedTax: heimdallProduct.getIncludedTaxFormatted(),
                productTitle: matchingOffer.name,
                top3: advantageCategories.top3,
                productInformationSheetUri: productInformationSheet.uri,
                productInformationSheetText: productInformationSheet.title,
                productBackgroundImageLink: productImageService.getRandomImageLinksForDeviceClass(wertgarantieProduct.deviceClass, 1)[0],
                shopProductShortName: wertgarantieProduct.shopProductName,
                orderId: wertgarantieProduct.orderId
            },
            avbHref: heimdallProduct.getDocument(documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION).uri
        };
    }

    return undefined
}