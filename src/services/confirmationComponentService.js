const defaultHeimdallClient = require('./heimdallClient');
const productOfferService = require('./heimdallProductOfferService');
const documentType = require('./heimdallProductOfferService').documentType;
const defaultProductImageService = require('./productImageService');
const defaultClientService = require('./clientService');
const _ = require('lodash');

exports.prepareConfirmationData = async function prepareConfirmationData(shoppingCart,
                                                                         heimdallClient = defaultHeimdallClient,
                                                                         productImageService = defaultProductImageService,
                                                                         clientService = defaultClientService) {
    if (!shoppingCart) {
        return undefined;
    }
    const result = {
        confirmed: shoppingCart.confirmed,
        title: "Herzlichen Glückwunsch, Du hast den besten Schutz für Deinen Einkauf ausgewählt.",
        confirmationHeader: "Bitte bestätige noch kurz:",
        products: [],
        shoppingCart: shoppingCart
    };

    let avbHref;
    const client = await clientService.findClientForPublicClientId(shoppingCart.clientId);
    for (var i = 0; i < shoppingCart.products.length; i++) {
        const wertgarantieProduct = shoppingCart.products[i];
        const confirmationProductData = await getConfirmationProductData(wertgarantieProduct, client, heimdallClient, productImageService);
        if (confirmationProductData) {
            result.products.push(confirmationProductData.product);
            avbHref = confirmationProductData.avbHref;
        }
    }

    result.confirmationTextGeneral = `Ich akzeptiere die Allgemeinen Versicherungsbedingungen <a href="${avbHref}">(AVB)</a> und die Bestimmungen zum Datenschutz. 
                                    Das gesetzliche Widerrufsrecht, die Produktinformationsblätter und die Vermittler-Erstinformation habe ich 
                                    zur Kenntnis genommen und alle Dokumente heruntergeladen. Mit der Bestätigung der Checkbox erkläre ich mich damit 
                                    einverstanden, dass mir alle vorstehenden Unterlagen an meine E-Mail-Adresse übermittelt werden. Der Übertragung 
                                    meiner Daten an Wertgarantie stimme ich zu. Der Betrag wird separat per Rechnung bezahlt.`;
    return result;
};

async function getConfirmationProductData(wertgarantieProduct, client, heimdallClient = defaultHeimdallClient, productImageService = defaultProductImageService) {
    const productOffers = await heimdallClient.getProductOffers(client, wertgarantieProduct.deviceClass, wertgarantieProduct.devicePrice);
    const productIndex = _.findIndex(productOffers, productOffer => productOffer.id === wertgarantieProduct.wertgarantieProductId);
    if (productIndex !== -1) {
        const matchingOffer = productOffers[productIndex];
        const heimdallProduct = productOfferService.fromProductOffer(matchingOffer);
        const advantageCategories = heimdallProduct.getAdvantageCategories(productOffers);
        const productInformationSheet = heimdallProduct.getDocument(documentType.PRODUCT_INFORMATION_SHEET);
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
            avbHref: heimdallProduct.getDocument(documentType.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE).uri
        };
    }

    return undefined
}