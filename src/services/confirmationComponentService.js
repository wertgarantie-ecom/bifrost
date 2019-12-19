const client = require('./heimdallClient');
const productService = require('./productService');
const productImageService = require('./productImageService');
const _ = require('lodash');

exports.prepareConfirmationData = function prepareConfirmationData(clientId, shoppingCart, heimdallClient = client) {
    const result = {
        signedShoppingCart: shoppingCart, // cookie mit signatur, damit die confirmation component das ins input feld schieben kann (TODO)
        confirmed: shoppingCart.confirmed,
        title: "Herzlichen Glückwunsch, Du hast den besten Schutz für Deinen Einkauf ausgewählt.",
        confirmatioHeader: "Bitte bestätige noch kurz:",
        products: []
    };
    let avbHref;
    shoppingCart.products.forEach(async product => {
        const imageLink = productImageService.getRandomImageLinksForDeviceClass(product.deviceClass, 1)[0];
        // 1. product-offers pro selektiertem Produkt ziehen und productId filtern
        // ODER
        // 2. (Optimierung) Alle angefragten Heimdall-Produkte in unserer DB speichern
        const productOffers = await heimdallClient.getProductOffers(clientId, product.deviceClass, product.devicePrice);
        const productIndex = _.findIndex(productOffers, productOffer => productOffer.id === product.wertgarantieProductId);
        if (productIndex !== -1) {
            const matchingOffer = productOffers[productIndex];
            avbHref = findAvbHref(matchingOffer);
            const advantageCategories = productService.getAdvantageCategories(matchingOffer, productOffers);
            result.products.push({
                paymentInterval: productService.getPaymentInterval(matchingOffer),
                price: matchingOffer.price_formatted,
                includedTax: productService.getIncludedTaxFormatted(matchingOffer),
                productTitle: matchingOffer.name,
                top3: advantageCategories.top3,
                productInformationSheetUri: productService.getProductInformationSheetUri(matchingOffer),
                productInformationSheetText: productService.getProductInformationSheetText(matchingOffer),
                productBackgroundImageLink: imageLink,
                shopProductShortName: product.shopProductName
            });
        }
    });

    result.confirmationTextGeneral = `Ich akzeptiere die Allgemeinen Versicherungsbedingungen <a href="${avbHref}">(AVB)</a> und die Bestimmungen zum Datenschutz. 
                                    Das gesetzliche Widerrufsrecht, die Produktinformationsblätter und die Vermittler-Erstinformation habe ich 
                                    zur Kenntnis genommen und alle Dokumente heruntergeladen. Mit der Bestätigung der Checkbox erkläre ich mich damit 
                                    einverstanden, dass mir alle vorstehenden Unterlagen an meine E-Mail-Adresse übermittelt werden. Der Übertragung 
                                    meiner Daten an Wertgarantie stimme ich zu. Der Betrag wird separat per Rechnung bezahlt.`;
    return result;
};

function findAvbHref(heimdallProduct) {
    return _.find(heimdallProduct.documents, ["document_type", "GTCI"]);
}