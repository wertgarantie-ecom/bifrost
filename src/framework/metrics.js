var StatsD = require('hot-shots');

let metricsSender;

function createMetricsSender() {
    if (process.env.METRICS_ENABLED === 'true') {
        const dogstasD = new StatsD({
            mock: process.env.METRICS_MOCK === 'true',
            globalTags: {env: process.env.NODE_ENV},
        });
        return activeMetricsSender(dogstasD);
    } else {
        return devNullMetricsSender();
    }
}

function metrics() {
    if (!metricsSender) {
        metricsSender = createMetricsSender();
    }
    return metricsSender;
}

function activeMetricsSender(dogstatsD) {
    const increment = (metrik, count, tags) => dogstatsD.increment(metrik, count, tags)
    const incrementComponentRequest = (componentName, request, result, clientName) => {
        const tags = [`component:${componentName}`,
            `request:${request}`,
            `result:${result}`,
            `client:${clientName}`];
        dogstatsD.increment(`bifrost.requests.components`, 1, tags);
    }
    const incrementShowComponentRequest = (componentName, componentDisplayData, clientName) => {
        return incrementComponentRequest(componentName, "show", componentDisplayData ? "show" : "hide", clientName)
    }
    const recordSubmitProposal = (checkoutData, clientName) => {
        // shop checkouts count: by supported device class | by insured (wertgarantie product attached)
        checkoutData.purchases
            .forEach(purchase => {
                const tags = [
                    `test:${checkoutData.test}`,
                    `deviceClass:${purchase.deviceClass}`,
                    `paymentInterval:${purchase.wertgarantieProductPaymentInterval}`,
                    `productName:${purchase.wertgarantieProductName}`,
                    `success:${purchase.success}`,
                    `client:${clientName}`];
                dogstatsD.increment('bifrost.proposals', 1, tags);
                dogstatsD.increment('bifrost.proposals.premiums', purchase.wertgarantieProductPremium, tags);
            })
    }

    return {
        increment,
        incrementShowComponentRequest,
        incrementComponentRequest,
        recordSubmitProposal
    }
}

function devNullMetricsSender() {
    const identity = _ => _;

    return {
        increment: identity,
        incrementShowComponentRequest: identity,
        incrementComponentRequest: identity,
        recordSubmitProposal: identity
    }

}

module.exports = metrics;
