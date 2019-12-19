const productService = require('./productService.js');
const _ = require('lodash');

exports.prepareConfirmationData = function prepareConfirmationData(clientId, shoppingCart, productClient = productService) {
    const result = {
        signedShoppingCart: shoppingCart, // cookie mit signatur, damit die confirmation component das ins input feld schieben kann (TODO)
        confirmed: shoppingCart.confirmed,
        title: "Herzlichen Glückwunsch, Du hast den besten Schutz für Deinen Einkauf ausgewählt.",
        confirmatioHeader: "Bitte bestätige noch kurz:",
        products: []
    };
    shoppingCart.products.forEach(async product => {
        // 1. product-offers pro selektiertem Produkt ziehen und productId filtern
        // ODER
        // 2. (Optimierung) Alle angefragten Heimdall-Produkte in unserer DB speichern
        const productOffers = await productClient.getProductOffers(product.deviceClass, product.devicePrice, clientId);
        const productIndex = _.findIndex(productOffers, productOffer => productOffer.id === product.wertgarantieProductId);
        if (productIndex !== -1) {
            const matchingOffer = productOffers[productIndex];
            result.avbHref = findAvbHref(matchingOffer);
            result.products.push({
                paymentInterval: matchingOffer.paymentInterval,
                price: matchingOffer.priceFormatted,
                includedTax: matchingOffer.taxFormatted,
                productTitle: matchingOffer.name,
                top3: matchingOffer.top_3,
                productInformationSheetUri: matchingOffer.infoSheetUri,
                productInformationSheetText: matchingOffer.infoSheetText,
                productBackgroundImageLink: matchingOffer.imageLink,
                shopProductShortName: product.shopProductName
            });
        }
    });

    result.confirmationTextGeneral = `Ich akzeptiere die Allgemeinen Versicherungsbedingungen <a href="${result.avbHref}">(AVB)</a> und die Bestimmungen zum Datenschutz. 
                                    Das gesetzliche Widerrufsrecht, die Produktinformationsblätter und die Vermittler-Erstinformation habe ich 
                                    zur Kenntnis genommen und alle Dokumente heruntergeladen. Mit der Bestätigung der Checkbox erkläre ich mich damit 
                                    einverstanden, dass mir alle vorstehenden Unterlagen an meine E-Mail-Adresse übermittelt werden. Der Übertragung 
                                    meiner Daten an Wertgarantie stimme ich zu. Der Betrag wird separat per Rechnung bezahlt.`;
    return result;
};

function findAvbHref(heimdallProduct) {
    return _.find(heimdallProduct.documents, ["document_type", "GTCI"]);
}