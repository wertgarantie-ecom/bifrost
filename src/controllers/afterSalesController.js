const afterSalesService = require('../services/afterSalesService');

exports.getAfterSalesData = async function getAfterSalesData(req, res, next) {
    const sessionId = req.params.sessionId;
    try {
        const result = await afterSalesService.prepareAfterSalesData(sessionId);
        if (!result) {
            return res.sendStatus(204);
        }
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
};

exports.componentCheckout = async function componentCheckout(req, res) {
    const shoppingCart = req.shoppingCart;
    //TODO validate webshopdata
    const webShopData = req.webshopData;
    const result = afterSalesService.checkout(shoppingCart, webShopData);
};