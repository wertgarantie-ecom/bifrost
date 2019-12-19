const defaultHeimdallClient = require('./heimdallClient');
const productOfferService = require('./heimdallProductOfferService');
const documentType = require('./heimdallProductOfferService').documentType;
const defaultProductImageService = require('./productImageService');
const _ = require('lodash');

exports.prepareConfirmationData = async function prepareConfirmationData(clientId, shoppingCart, heimdallClient = defaultHeimdallClient, productImageService = defaultProductImageService) {
    const result = {
        signedShoppingCart: shoppingCart,
        confirmed: shoppingCart.confirmed,
        title: "Herzlichen Glückwunsch, Du hast den besten Schutz für Deinen Einkauf ausgewählt.",
        confirmatioHeader: "Bitte bestätige noch kurz:",
        products: []
    };
    let avbHref;
    const confirmationProductData = await Promise.all(shoppingCart.products.map(async wertgarantieProduct => {
        const productOffersResponse = await heimdallClient.getProductOffers(clientId, wertgarantieProduct.deviceClass, wertgarantieProduct.devicePrice);
        const productOffers = productOffersResponse.payload;
        const productIndex = _.findIndex(productOffers, productOffer => productOffer.id === wertgarantieProduct.wertgarantieProductId);
        if (productIndex !== -1) {
            const matchingOffer = productOffers[productIndex];
            const shopProduct = productOfferService.fromProductOffer(matchingOffer);
            const advantageCategories = shopProduct.getAdvantageCategories(productOffers);
            const productInformationSheet = shopProduct.getDocument(documentType.PRODUCT_INFORMATION_SHEET);
            avbHref = shopProduct.getDocument(documentType.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE).uri;
            return {
                paymentInterval: shopProduct.getPaymentInterval(),
                price: matchingOffer.price_formatted,
                includedTax: shopProduct.getIncludedTaxFormatted(),
                productTitle: matchingOffer.name,
                top3: advantageCategories.top3,
                productInformationSheetUri: productInformationSheet.uri,
                productInformationSheetText: productInformationSheet.title,
                productBackgroundImageLink: productImageService.getRandomImageLinksForDeviceClass(wertgarantieProduct.deviceClass, 1)[0],
                shopProductShortName: wertgarantieProduct.shopProductName
            };
        }

        return {};
    }));

    result.products.push(...confirmationProductData);
    result.confirmationTextGeneral = `Ich akzeptiere die Allgemeinen Versicherungsbedingungen <a href="${avbHref}">(AVB)</a> und die Bestimmungen zum Datenschutz. 
                                    Das gesetzliche Widerrufsrecht, die Produktinformationsblätter und die Vermittler-Erstinformation habe ich 
                                    zur Kenntnis genommen und alle Dokumente heruntergeladen. Mit der Bestätigung der Checkbox erkläre ich mich damit 
                                    einverstanden, dass mir alle vorstehenden Unterlagen an meine E-Mail-Adresse übermittelt werden. Der Übertragung 
                                    meiner Daten an Wertgarantie stimme ich zu. Der Betrag wird separat per Rechnung bezahlt.`;

    return result;
};

