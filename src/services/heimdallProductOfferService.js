const _ = require("lodash");

exports.fromProductOffer = function fromProduct(productOffer) {
    return {
        getPaymentInterval() {
            switch (productOffer.defaultPaymentInterval) {
                case "monthly":
                    return "monatl.";
                case "quarterly":
                    return "pro Quartal";
                case "halfYearly":
                    return "halbjährl.";
                case "yearly":
                    return "jährl.";
            }
        },


        getAdvantageCategories(allProductOffers) {
            function getExcludedAdvantages(advantages, allProductOffers) {
                const advantagesSet = new Set(advantages);
                var allAdvantages = [];
                allProductOffers.forEach(offer => {
                    allAdvantages = allAdvantages.concat(offer.advantages);
                });
                return Array.from(new Set(allAdvantages.filter(adv => !advantagesSet.has(adv))));
            }

            const advantages = productOffer.advantages;
            const excludedAdvantages = getExcludedAdvantages(advantages, allProductOffers);
            const top3 = advantages.splice(0, 3);

            return {
                advantages: advantages,
                excludedAdvantages: excludedAdvantages,
                top3: top3
            }
        },

        getIncludedTaxFormatted() {
            const intervalPrice = productOffer.prices[productOffer.defaultPaymentInterval];
            const formattedNumber = new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: intervalPrice.price_currency
            }).format(intervalPrice.price_tax);
            return "(inkl. " + formattedNumber + " VerSt**)"
        },

        getDocument(documentType) {
            const document = _.find(productOffer.documents, ["document_type", documentType]);
            return {
                title: _.get(document, "document_title"),
                uri: _.get(document, "document_link")
            }
        }
    }
};

exports.documentType = {
    SEPA: "SEPA", //SEPA Lastschriftmandat
    PRODUCT_INFORMATION_SHEET: "PIS", //Produktinformationsblatt
    GENERAL_INSURANCE_PRODUCTS_INFORMATION: "IPID", //Informationsblatt für Versicherungsprodukte
    INSURANCE_CERTIFICATE: "POLICY", // Versicherungsschein
    GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE: "GTCI",
    LEGAL_NOTICE: null
};
