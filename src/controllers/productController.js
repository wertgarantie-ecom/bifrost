const request = require('request');
const heimdallUri = process.env.HEIMDALL_URI || "http://localhost:3001";
const service = require('../services/productService.js');

exports.getProducts = function getProducts(req, res, next) {
    console.log("Calling through selection popup");
    try {
        const products = service.getProductOffers(req.query.deviceClass, req.query.devicePrice)
        console.log("------------------- from controller -------------------");
        console.log(products);
        res.send({
            title: "Vergessen Sie nicht Ihren Rundumschutz",
            products: products
        });
    } catch (e) {
        next(e);
    }
}

exports.getDummyMockProduct = function getDummyMockProduct(req, res, next) {
    const options = {
        //TODO parse query params and set correct id and price, date should be now
        url: heimdallUri + "/api/v1/dummy-product?device_class=" + req.query.deviceClass + 
            "&product_id=" + req.query.productId,
        headers: {
            "Accept": "application/json",
            "Authorization": "12345"
        }
    };
    request(options, (error, response, body) => {
        if (response.statusCode !== 200) {
            res.status(response.statusCode).send(response.body);
        }
        const payload = JSON.parse(body);
        let imageLink;
        try {
            imageLink = service.getRandomImageLinksForDeviceClass(req.query.deviceClass, 1)
        } catch (e) {
            return next(e);
        }
        res.send(service.convertPayloadToProduct(payload, imageLink));
    });
}