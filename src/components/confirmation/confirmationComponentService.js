const productOfferFormattingService = require('../../productoffers/productOfferFormattingService');
const _productOfferService = require('../../productoffers/productOffersService');
const documentTypes = require('../../documents/documentTypes').documentTypes;
const defaultProductImageService = require('../../images/productImageService');
const defaultClientService = require('../../clientconfig/clientService');
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
        const productOfferFormatter = productOfferFormattingService.fromProductOffer(matchingOffer);
        matchingOffer.payment = productOfferFormatter.getPaymentInterval();
        const advantageCategories = productOfferFormatter.getAdvantageCategories(productOffers);
        const productInformationSheet = productOfferFormatter.getDocument(documentTypes.PRODUCT_INFORMATION_SHEET);
        return {
            product: {
                paymentInterval: matchingOffer.payment,
                price: productOfferFormatter.getPriceFormatted(),
                includedTax: productOfferFormatter.getIncludedTaxFormatted(),
                productTitle: matchingOffer.name,
                top3: advantageCategories.top3,
                productInformationSheetUri: productInformationSheet.uri,
                productInformationSheetText: productInformationSheet.name,
                productBackgroundImageLink: productImageService.getRandomImageLinksForDeviceClass(wertgarantieProduct.deviceClass, 1)[0],
                shopProductShortName: wertgarantieProduct.shopProductName,
                orderId: wertgarantieProduct.orderId
            },
            avbHref: productOfferFormatter.getDocument(documentTypes.LEGAL_NOTICE).uri
        };
    }

    return undefined
}