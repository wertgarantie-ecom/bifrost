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
        incrementComponentRequest: (componentName, request, result, clientName) => {
            const tags = [`component:${componentName}`,
                `request:${request}`,
                `result:${result}`,
                `client:${clientName}`];
            dogstatsD.increment(`bifrost.requests.components`, 1, tags);
        },
        recordSubmitProposalRequest(result, checkoutData, clientName, test) {
            const tags = [`test:${test}`,
                `result:${result}`,
                `client:${clientName}`];
            dogstasD.increment('bifrost.proposals', checkoutData.purchases.length, tags);
        }
    }
}

function devNullMetricsSender() {
    const identity = _ => _;

    return {
        incrementComponentRequest: identity,
        recordSubmitProposalRequest: identity
    }

}

module.exports = metrics;
