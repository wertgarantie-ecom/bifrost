const _ = require("lodash");
const Globalize = require('../globalize').Globalize;

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
            const globalizer = Globalize.getInstance();
            const formattedTax = globalizer.currencyFormatter(intervalPrice.priceCurrency, {style: "accounting"})(intervalPrice.priceTax / 100);
            return "(inkl. " + formattedTax + " VerSt**)"
        },

        getPriceFormatted() {
            const intervalPrice = productOffer.prices[productOffer.defaultPaymentInterval];
            const globalizer = Globalize.getInstance();
            const formattedPrice = globalizer.currencyFormatter(intervalPrice.priceCurrency, {style: "accounting"})(intervalPrice.price / 100);
            return "ab " + formattedPrice + " " + productOffer.payment;
        },

        getDocument(documentType) {
            const document = _.find(productOffer.documents, ["type", documentType]);
            return {
                name: _.get(document, "name"),
                uri: _.get(document, "uri")
            }
        }
    }
};