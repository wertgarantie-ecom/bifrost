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
            function getExcludedAdvantages(advantages, allAdvantages) {
                const advantagesSet = new Set(advantages);
                return Array.from(new Set(allAdvantages.filter(adv => !advantagesSet.has(adv))));
            }

            function getTop3(advantages, excludedAdvantages) {
                const top3 = [
                    {
                        text: advantages.splice(0, 1)[0],
                        included: true
                    }
                ];
                while (excludedAdvantages.length > 0 && top3.length < 3) {
                    top3.push({
                        text: excludedAdvantages.splice(0, 1)[0],
                        included: false
                    });
                }
                while (top3.length < 3 && advantages.length > 0) {
                    top3.push({
                        text: advantages.splice(0, 1)[0],
                        included: true
                    });
                }
                return _.orderBy(top3, ['included'], ['desc']);
            }

            const allAdvantages = [];
            allProductOffers.map(offer => {
                allAdvantages.push(...offer.advantages);
            });
            const advantages = _.cloneDeep(productOffer.advantages);
            const excludedAdvantages = getExcludedAdvantages(advantages, allAdvantages);
            const top3 = getTop3(advantages, excludedAdvantages);



            return {
                advantages: excludedAdvantages.map(adv => {
                    return {
                        text: adv,
                        included: false
                    }
                }).concat(advantages.map(adv => {
                    return {
                        text: adv,
                        included: true
                    }
                })),
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