const afterSalesService = require('./afterSalesService');

exports.getAfterSalesData = async function getAfterSalesData(req, res, next) {
    const sessionId = req.params.sessionId;
    try {
        const result = await afterSalesService.showAfterSalesComponent(sessionId, req.clientConfig, req.locale.language, req.useragent);
        if (!result) {
            return res.sendStatus(204);
        }
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
};

exports.componentCheckout = async function componentCheckout(req, res, next) {
    try {
        const result = await afterSalesService.checkoutAndShowAfterSalesComponent(req.shoppingCart, req.clientConfig, req.body.webshopData, req.locale.language, req.useragent);
        res.set('X-wertgarantie-shopping-cart-delete', true);
        if (!result) {
            return res.sendStatus(204);
        }
        return res.status(200).send(result)
    } catch (error) {
        return next(error)
    }
};