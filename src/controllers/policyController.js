const request = require('request');
const heimdallUri = process.env.HEIMDALL_URI || "http://localhost:3001";
const service = require('../services/policyService.js');

exports.dummyPolicies = function getDummyPolicies(req, res, next) {
    let date = new Date();
    const options = {
        //TODO parse query params and set correct id and price, date should be now
        url: heimdallUri + "/api/v1/dummy-product-offers?device_class=" + req.query.deviceClass + 
            "&device_purchase_price=" + req.query.devicePrice +
            "&device_purchase_date=" + date.toLocaleDateString(),
        headers: {
            "Accept": "application/json",
            "Authorization": "12345"
        }
    };

    request(options, (error, response, body) => {
        const content = JSON.parse(body);
        let products = [];
        let imageLinks = [];
        try {
            imageLinks = service.getRandomImageLinksForDeviceClass(req.query.deviceClass, content.payload.length)
        } catch (e) {
            return next(e);
        }
        content.payload.forEach((payload, idx) => {
            const product = service.convertPayloadToProduct(payload, imageLinks[idx]);
            products.push(product);
        });
        res.send({
            title: "Vergessen Sie nicht Ihren Rundumschutz",
            products: products
        });
    });
}

exports.policies = function getPolicies(req, res) {
    // request parameter variabel setzen können
    console.log("calling: " + heimdallUri);
    const options = {
        //TODO parse query params and set correct id and price, date should be now
        url: heimdallUri + "/api/v1/product-offers?device_class=04854bfa-1a02-4b44-b981-46f7ead8bb7e&device_purchase_price=800&device_purchase_date=2018-09-01",
        headers: {
            "Accept": "application/json",
            "Authorization": "12345"
        }
    };

    request(options, (error, response, body) => {
        const content = JSON.parse(body);
        let products = [];
        content.payload.forEach(payload => {
            products.push({
                name: payload.name,
                services: payload.services,
                advantages: payload.advantages,
                infoSheetText: payload.documents[0].document_title,
                infoSheetUri: payload.documents[0].document_link,
                detailsText: payload.documents[1].document_title,
                detailsUri: payload.documents[1].document_link,
                paymentInterval: payload.payment,
                price: payload.price,
                currency: payload.price_currency,
                priceFormatted: payload.price_formatted,
                tax: payload.price_tax
            })
        })
        res.send({
            title: "Vergessen Sie nicht Ihren Rundumschutz",
            products: products
        });
    });
};

exports.getProduct = function getProduct(req, res, next) {
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