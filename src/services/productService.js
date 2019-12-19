exports.getPaymentInterval = function getPaymentInterval(heimdallProductOffer) {
    if (heimdallProductOffer.payment === "Monat") {
        return "monatl.";
    } else if (heimdallProductOffer.payment === "Jahr") {
        return "jährl.";
    } else {
        return "pro " + heimdallProductOffer.payment;
    }
}

function getExcludedAdvantages(advantages, allProductOffers) {
    const advantagesSet = new Set(advantages);
    var allAdvantages = [];
    allProductOffers.forEach(payload => {
        allAdvantages = allAdvantages.concat(payload.special_advantages, payload.services, payload.advantages);
    });
    return Array.from(new Set(allAdvantages.filter(adv => !advantagesSet.has(adv))));
}

exports.getAdvantageCategories = function getAdvantageCategories(heimdallProductOffer, allProductOffers) {
    const advantages = heimdallProductOffer.special_advantages.concat(heimdallProductOffer.services, heimdallProductOffer.advantages);
    const excludedAdvantages = getExcludedAdvantages(advantages, allProductOffers);
    const top3 = advantages.splice(0, 3);

    return {
        advantages: advantages,
        excludedAdvantages: excludedAdvantages,
        top3: top3
    }
}

exports.getIncludedTaxFormatted = function getIncludedTaxFormatted(heimdallProductOffer) {
    return "(inkl. " + heimdallProductOffer.price_tax + heimdallProductOffer.price_currency + " VerSt**)"
}

exports.getDocumentUri = function getProductInformationSheetUri(heimdallProductOffer, docIdentifier) {
    // documents filtern nach PIS --> document_link
}

exports.getText = function getProductInformationSheetText(heimdallProductOffer, docIdentifier) {
    // documents filtern nach PIS --> document_title
}