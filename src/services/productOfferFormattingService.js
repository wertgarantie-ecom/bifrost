const _ = require("lodash");
const Globalize = require('../globalize').Globalize;
const documentTypes = require('./documentTypes').documentTypes;

exports.fromProductOffer = function fromProductOffer(productOffer) {
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
            const globalizer = Globalize.getInstance();
            const formattedTax = globalizer.currencyFormatter(intervalPrice.priceCurrency, {style: "accounting"})(intervalPrice.priceTax / 100);
            return "(inkl. " + formattedTax + " VerSt**)"
        },

        getPriceFormatted() {
            const intervalData = productOffer.prices[productOffer.defaultPaymentInterval];
            const globalizer = Globalize.getInstance();
            const formattedPrice = globalizer.currencyFormatter(intervalData.priceCurrency, {style: "accounting"})(intervalData.price / 100);
            return "ab " + formattedPrice;
        },

        getDocument(documentType) {
            function documentTypeToDescription(documentType) {
                switch (documentType) {
                    case documentTypes.PRODUCT_INFORMATION_SHEET:
                        return "Produktinformationsblatt";
                    case documentTypes.LEGAL_NOTICE:
                        return "Rechtsdokumente";
                    case documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION:
                        return "Informationsblatt für Versicherungsprodukte";
                    case documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE:
                        return "Allgemeine Versicherungsbedingungen";
                    case documentTypes.COMPARISON:
                        return "Vergleichsdokument";
                }
            }

            const document = _.find(productOffer.documents, ["type", documentType]);
            if (!document) {
                return undefined;
            }
            return {
                name: documentTypeToDescription(document.type),
                uri: _.get(document, "uri")
            }
        }
    }
};