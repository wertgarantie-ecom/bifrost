const policyService = require('./productService.js');

exports.prepareConfirmationData = function prepareConfirmationData(clientId, shoppingCart) {
    const result = {}
    result.signedShoppingCart = shoppingCart; // cookie mit signatur, damit die confirmation component das ins input feld schieben kann (TODO)
    result.title = "HERZLICHEN GLÜCKWUNSCH, DU HAST DEN BESTEN SCHUTZ FÜR DEINEN EINKAUF AUSGEWÄHLT.";
    result.confirmatioHeader = "BITTE BESTÄTIGE NOCH KURZ:";
    result.confirmationTextGeneral = `Ich akzeptiere die Allgemeinen Versicherungsbedingungen <a href=${avbHref}>(AVB)</a> und die Bestimmungen zum Datenschutz. 
                                    Das gesetzliche Widerrufsrecht, die Produktinformationsblätter und die Vermittler-Erstinformation habe ich 
                                    zur Kenntnis genommen und alle Dokumente heruntergeladen. Mit der Bestätigung der Checkbox erkläre ich mich damit 
                                    einverstanden, dass mir alle vorstehenden Unterlagen an meine E-Mail-Adresse übermittelt werden. Der Übertragung 
                                    meiner Daten an Wertgarantie stimme ich zu. Der Betrag wird separat per Rechnung bezahlt.`;
    shoppingCart.products.forEach(product => {
        // 1. product-offers pro selektiertem Produkt ziehen und productId filtern
        // ODER
        // 2. (Optimierung) Alle angefragten Heimdall-Produkte in unserer DB speichern
        policyService.getProductOffers(product.deviceClass, product.devicePrice);

    })
    result.products = [
        {
            paymentInterval: "",
            price: "",
            includedTax: "",
            productTitle: "",
            top3: [],
            productInformationSheetUri: "",
            productBackgroundImageLink: "",
            shopProductShortName: ""
        }
    ];
    

}

// {
//     "37382522-d7ce-439a-8d78-abc0a0970cbd": {
    //     "clientId": "37382522-d7ce-439a-8d78-abc0a0970cbd",
    //     "products": [
    //     {
        //     "productId": "14",
        //     "deviceClass": "1dfd4549-9bdc-4285-9047-e5088272dade",
        //     "devicePrice": "800",
        //     "deviceCurrency": "EUR",
        //     "shopProductName": "Super Phone",
        //     "orderId": "760c5df1-6086-4ddc-bb5c-ea11fb6275ac"
    //     },
    //     {
        //     "productId": "14",
        //     "deviceClass": "1dfd4549-9bdc-4285-9047-e5088272dade",
        //     "devicePrice": "800",
        //     "deviceCurrency": "EUR",
        //     "shopProductName": "Super Phone",
        //     "orderId": "a35d9b65-9118-4ae2-bbfd-bbdeb448642c"
    //     }
    //     ],
    //     "confirmed": false
//     }
// }