const _ = require('lodash');
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
    const incrementComponentRequest = (componentName, request, result, clientName, userAgent) => {
        let userAgentTag;
        if (userAgent) {
            userAgentTag = userAgent.isDesktop ? 'desktop' : userAgent.isTablet ? 'tablet' : userAgent.isMobile ? 'mobile' : 'unknown';
        } else {
            userAgentTag = 'unknown';
        }
        const tags = [`component:${componentName}`,
            `request:${request}`,
            `result:${result}`,
            `userAgent:${userAgentTag}`,
            `client:${clientName}`];
        dogstatsD.increment(`bifrost.requests.components`, 1, tags);
    };
    const incrementShowComponentRequest = (componentName, componentDisplayData, clientName, userAgent) => {
        return incrementComponentRequest(componentName, "show", componentDisplayData ? "show" : "hide", clientName, userAgent)
    };
    const recordSubmitProposal = (checkoutData, clientName) => {
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
    };

    const recordShopCheckout = async (purchasedShopProducts, clientConfig, productOffersService) => {
        await Promise.all(purchasedShopProducts.map(async shopProduct => {
            const productOffers = await productOffersService.getProductOffers(clientConfig, shopProduct.deviceClasses, shopProduct.price, 2);
            let isInsurable = false;
            let priceRange = "none";
            if (productOffers) {
                isInsurable = true;
                priceRange = productOffers[0].priceRange.minClose + " - " + productOffers[0].priceRange.maxOpen;
            }
            const tags = [
                `insurable:${isInsurable}`,
                `priceRange:${priceRange}`,
                `client:${clientConfig.name}`];
            dogstatsD.increment('bifrost.shop.purchasedProducts', 1, tags)
        }));
    };

    return {
        increment,
        incrementShowComponentRequest,
        incrementComponentRequest,
        recordSubmitProposal,
        recordShopCheckout
    }
}

function devNullMetricsSender() {
    const identity = _ => _;

    return {
        increment: identity,
        incrementShowComponentRequest: identity,
        incrementComponentRequest: identity,
        recordSubmitProposal: identity,
        recordShopCheckout: identity
    }

}

module.exports = metrics;
