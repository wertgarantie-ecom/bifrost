const _ = require("lodash");
const Globalize = require('../framework/globalize').Globalize;
const format = require('util').format;

exports.fromProductOffer = function fromProductOffer(productOffer, componentTexts) {
    return {
        getPaymentInterval() {
            switch (productOffer.defaultPaymentInterval) {
                case "monthly":
                    return componentTexts.productTexts.paymentIntervals.monthly;
                case "quarterly":
                    return componentTexts.productTexts.paymentIntervals.quarterly;
                case "halfYearly":
                    return componentTexts.productTexts.paymentIntervals.halfYearly;
                case "yearly":
                    return componentTexts.productTexts.paymentIntervals.yearly;
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

        getIncludedTaxFormatted(locale = "de") {
            const intervalPrice = productOffer.prices[productOffer.defaultPaymentInterval];
            const formattedTax = Globalize(locale).currencyFormatter(intervalPrice.priceCurrency, {style: "accounting"})(intervalPrice.priceTax / 100);
            return format(componentTexts.productTexts.taxInformation, formattedTax);
        },

        getPriceFormatted(locale = "de") {
            const intervalData = productOffer.prices[productOffer.defaultPaymentInterval];
            return Globalize(locale).currencyFormatter(intervalData.priceCurrency, {style: "accounting"})(intervalData.price / 100);
        },

        getDocument(documentType) {
            function documentTypeToDescription(documentType) {
                return componentTexts.documents[documentType];
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