const request = require('request');
const heimdallUri = process.env.HEIMDALL_URI || "http://localhost:3001";
const service = require('../services/productService.js');

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

