var StatsD = require('hot-shots');

let dogstasD;


function metrics() {
    if (process.env.METRICS_ENABLED === 'true') {
        if (dogstasD) {
            return dogstasD;
        } else {
            dogstasD = new StatsD({
                mock: process.env.METRICS_MOCK === 'true',
                globalTags: {env: process.env.NODE_ENV},
            });
            return activeMetricsSender(dogstasD);
        }
    }
    return devNullMetricsSender();
}

function activeMetricsSender(dogstatsD) {
    return {
        increment: (metrik, count, tags) => dogstatsD.increment(metrik, count, tags),
        incrementShowComponentRequest: (componentName, componentDisplayData, clientName) => {
            return this.incrementComponentRequest(componentName, "show", componentDisplayData ? "show" : "hide", clientName)
        },
        incrementComponentRequest: (componentName, request, result, clientName) => {
            const tags = [`component:${componentName}`,
                `request:${request}`,
                `result:${result}`,
                `client:${clientName}`];
            dogstatsD.increment(`bifrost.requests.components`, 1, tags);
        },
        recordSubmitProposalRequest(checkoutData, clientName) {
            // shop checkouts count: by supported device class | by insured (wertgarantie product attached)
            // wie viele Anträge werden erstellt
            // wertgarantie checkouts count: by deviceClass | by productName
            // umsatz: prämien count: by interval | normalized to one year
            const result = checkoutData.purchases.length === 0 ? 'no_proposals' : 'proposals_created';
            const tags = [`test:${checkoutData.test}`,
                `result:${result}`,
                `client:${clientName}`];
            dogstasD.increment('bifrost.proposals', checkoutData.purchases.length, tags);
        }
    }
}

function devNullMetricsSender() {
    const identity = _ => _;

    return {
        incrementShowComponentRequest: identity,
        incrementComponentRequest: identity,
        recordSubmitProposalRequest: identity
    }

}

module.exports = metrics;
