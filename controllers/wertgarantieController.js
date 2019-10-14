const request = require('request');

exports.dummyPolicies = function getDummyPolicies(req, res) {
    // request parameter variabel setzen können
    const heimdallUri = process.env.HEIMDALL_URI || "http://localhost:3001";
    console.log("calling: " + heimdallUri);
    const options = {
        //TODO parse query params and set correct id and price, date should be now
        url: heimdallUri + "/api/v1/dummy-product-offers?device_class=04854bfa-1a02-4b44-b981-46f7ead8bb7e&device_purchase_price=800&device_purchase_date=2018-09-01",
        headers: {
            "Accept": "application/json",
            "Authorization": "12345"
        }
    };

    request(options, (error, response, body) => {
        const content = JSON.parse(body);
        let products = [];
        content.payload.forEach(payload => {
            if (payload.payment === "Monat") {
                payload.payment = "monatl.";
            } else if (payload.payment === "Jahr") {
                payload.payment = "jährl.";
            } else {
                payload.payment = "pro " + payload.payment;
            }

            const advantages = payload.advantages.concat(payload.services);
            products.push({
                id: payload.id,
                name: payload.name,
                top_3: payload.top_3,
                advantages: advantages,
                excludedAdvantages: payload.excluded_advantages,
                infoSheetText: payload.documents[0].document_title,
                infoSheetUri: payload.documents[0].document_link,
                detailsDocText: payload.documents[1].document_title,
                detailsDocUri: payload.documents[1].document_link,
                paymentInterval: payload.payment,
                price: payload.price,
                currency: payload.price_currency,
                priceFormatted: payload.price_formatted,
                tax: payload.price_tax,
                taxFormatted: "(inkl. " + payload.price_tax + payload.price_currency + " VerSt**)"
            });
        });
        res.send({
            title: "Vergessen Sie nicht Ihren Rundumschutz",
            products: products
        });
    });
}

exports.policies = function getPolicies(req, res) {
    // request parameter variabel setzen können
    const heimdallUri = process.env.HEIMDALL_URI || "http://localhost:3001";
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


/*
{
    "payload": [
        {
            "id": 11,
            "premium": false,
            "name": "Schutzpaket Premium",
            "payment": "Monat",
            "url": null,
            "utm_campaign": null,
            "services": [],
            "advantages": [
                "Fall und Sturzschäden",
                "Feuchtigkeitsschäden",
                "Verschleiß inkl. Akku Defekten"
            ],
            "price": "9,95",
            "price_type": "ab",
            "price_currency": "€",
            "price_formatted": "ab 9,95 €",
            "price_tax": "1,59",
            "documents": [
                {
                    "document_title": "Informationsblatt für Versicherungsprodukte",
                    "document_file": "schutzpaket_md_premium_2017_|_ipid_premium",
                    "document_type": "IPID",
                    "document_link": "https://stage-api.wertgarantie.com/download/b5cf7159-264e-4f0a-a6df-485f62afb814"
                },
                {
                    "document_title": "Allgemeine Versicherungsbedingungen",
                    "document_file": "schutzpaket_md_premium_2017_|_avb_premium",
                    "document_type": "GTCI",
                    "document_link": "https://stage-api.wertgarantie.com/download/76c4e67c-89bf-4bd4-a1d2-b6470ed07629"
                }
            ]
        },
        {
            "id": 14,
            "premium": true,
            "name": "Schutzpaket Premium inkl. Diebstahlschutz",
            "payment": "Monat",
            "url": null,
            "utm_campaign": null,
            "services": [
                "einfacher Diebstahl"
            ],
            "advantages": [
                "Fall und Sturzschäden",
                "Feuchtigkeitsschäden",
                "Verschleiß inkl. Akku Defekten"
            ],
            "price": "11,95",
            "price_type": "ab",
            "price_currency": "€",
            "price_formatted": "ab 11,95 €",
            "price_tax": "1,91",
            "documents": [
                {
                    "document_title": "Informationsblatt für Versicherungsprodukte",
                    "document_file": "schutzpaket_md_premium_2017_|_ipid_premium",
                    "document_type": "IPID",
                    "document_link": "https://stage-api.wertgarantie.com/download/b17f85d5-58c1-416c-869f-85ff572afd9c"
                },
                {
                    "document_title": "Allgemeine Versicherungsbedingungen",
                    "document_file": "schutzpaket_md_premium_2017_|_avb_premium",
                    "document_type": "GTCI",
                    "document_link": "https://stage-api.wertgarantie.com/download/49b77b3d-a949-4fa9-8c51-34edadfa959d"
                }
            ]
        }
    ]
}
*/