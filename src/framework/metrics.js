var StatsD = require('hot-shots');

let dogstasD;

function metrics() {
    if (process.env.METRICS_ENABLED) {
        if (dogstasD) {
            return dogstasD;
        } else {
            dogstasD = new StatsD({
                mock: process.env.METRICS_MOCK,
                globalTags: {env: process.env.NODE_ENV},
            });
            return dogstasD;
        }
    }
    return {
        increment: _ => _
    };
}

module.exports = metrics;
