const _ = require("lodash");

exports.fromProductOffer = function fromProduct(heimdallProductOffer) {
    return {
        getPaymentInterval() {
            if (heimdallProductOffer.payment === "Monat") {
                return "monatl.";
            } else if (heimdallProductOffer.payment === "Jahr") {
                return "jährl.";
            } else {
                return "pro " + heimdallProductOffer.payment;
            }
        },


        getAdvantageCategories(allProductOffers) {
            function getExcludedAdvantages(advantages, allProductOffers) {
                const advantagesSet = new Set(advantages);
                var allAdvantages = [];
                allProductOffers.forEach(payload => {
                    allAdvantages = allAdvantages.concat(payload.special_advantages, payload.services, payload.advantages);
                });
                return Array.from(new Set(allAdvantages.filter(adv => !advantagesSet.has(adv))));
            }

            const advantages = heimdallProductOffer.special_advantages.concat(heimdallProductOffer.services, heimdallProductOffer.advantages);
            const excludedAdvantages = getExcludedAdvantages(advantages, allProductOffers);
            const top3 = advantages.splice(0, 3);

            return {
                advantages: advantages,
                excludedAdvantages: excludedAdvantages,
                top3: top3
            }
        },

        getIncludedTaxFormatted() {
            return "(inkl. " + heimdallProductOffer.price_tax + heimdallProductOffer.price_currency + " VerSt**)"
        },

        getDocument(documentType) {
            const document = _.find(heimdallProductOffer.documents, ["document_type", documentType]);
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
