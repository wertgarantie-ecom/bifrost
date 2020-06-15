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
    const recordSubmitProposalRequest = (checkoutData, clientName) => {
        // shop checkouts count: by supported device class | by insured (wertgarantie product attached)
        // wie viele Anträge werden erstellt
        // wertgarantie checkouts count: by deviceClass | by productName
        // umsatz: prämien count: by interval | normalized to one year
        const result = checkoutData.purchases.length === 0 ? 'no_proposals' : 'proposals_created';
        const tags = [`test:${checkoutData.test}`,
            `result:${result}`,
            `client:${clientName}`];
        dogstatsD.increment('bifrost.proposals', checkoutData.purchases.length, tags);
    }

    return {
        increment,
        incrementShowComponentRequest,
        incrementComponentRequest,
        recordSubmitProposalRequest
    }
}

function devNullMetricsSender() {
    const identity = _ => _;

    return {
        increment: identity,
        incrementShowComponentRequest: identity,
        incrementComponentRequest: identity,
        recordSubmitProposalRequest: identity
    }

}

module.exports = metrics;
