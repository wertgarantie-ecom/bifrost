const service = require('../services/productSelectionPopUpComponentService.js');

exports.getProducts = async function getProducts(req, res, next) {
    try {
        const products = await service.getProductOffers(req.query.deviceClass, req.query.devicePrice);
        res.send({
            title: "Vergessen Sie nicht Ihren Rundumschutz",
            products: products
        });
    } catch (e) {
        next(e);
    }
};
