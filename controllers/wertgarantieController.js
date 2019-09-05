const request = require('request');

exports.policies = function getPolicies(req, res) {
    // request parameter variabel setzen können
    const options = {
        //TODO parse query params and set correct id and price, date should be now
        url: "http://localhost:3001/api/v1/product-offers?device_class=04854bfa-1a02-4b44-b981-46f7ead8bb7e&device_purchase_price=800&device_purchase_date=2018-09-01",
        headers: {
            "Accept": "application/json",
            "Authorization": "12345"
        }
    };

    request(options, (error, response, body) => {
        const content = JSON.parse(body);
        const payload = content.payload[0];
        res.send({
            title: "Vergessen Sie nicht Ihren Rundumschutz",
            advantages: payload.advantages,
            checkboxLabel: `Schutzpaket Premium für nur mtl. ${payload.price} ${payload.price_currency} aktivieren`,
            infoSheetText: "Produktinformationsblatt",
            infoSheetUri: payload.documents[0].document_link,
            detailsText: "Alle Details zum Tarif",
            detailsUri: payload.url
        });
    });
};
/*
"payload": [
    {
        "id": 1,
        "name": "Komplettschutz",
        "payment": "Monat",
        "url":
            "https://www.wertgarantie.com/Home/Landingpage/komplettschutz.aspx",
        "utm_campaign": "offer-ks",
        "services": [
            "Schutz vor Reparaturkosten"
        ],
        "advantages": [
            "Reparaturkostenübernahme bei Sturzschäden, Akkudefekten, Wasserschäden, u.v.m.",
            "Auch für Gebrauchtgeräte",
            "Schnelle, unkomplizierte Schadensabwicklung",
            "Kostenbeteiligung bei Neukauf"
        ],
        "price": "5,00",
        "price_type": "ab",
        "price_currency": "€",
        "price_formatted": "ab 5,00 €",
        "price_tax": "0,80",
        "documents": [
            {
                "document_title": "gu_wg_de_ks_0918_rechtsdokumente.pdf",
                "document_file": "gu_wg_de_ks_0918_rechtsdokumente.pdf",
                "document_link": "https://api.wertgarantie.com/download/84fa9900-f476-4917- a79c-5fa1cb26ea53"
            }
        ]
    }
]
*/