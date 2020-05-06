const documents = {
    "PIS": "Produktinformationsblatt",
    "IPID": "Informationsblatt für Versicherungsprodukte",
    "GTCI": "Allgemeine Versicherungsbedingungen"
};

const paymentIntervals = {
    "monthly": "monatl.",
    "quarterly": "vierteljährl.",
    "halfYearly": "habljährl.",
    "yearly": "jährl."
};

exports.defaultComponentTexts = {
    "selectionpopup": {
        "de": {
            "title": "Vergessen Sie nicht Ihren Rundumschutz",
            "subtitle": "Wählen Sie die Versicherung aus, die Ihnen zusagt",
            "footerHtml": "Versicherung ist Vertrauenssache, deshalb setzt %s neben <strong>500.000 zufriedener Kunden</strong> auf die <strong>Wertgarantie</strong>, den <strong>Testsieger in Sachen Sicherheit</strong>",
            "partnerShop": "Testshop",
            "detailsHeader": "Weitere Vorteile:",
            "furtherInformation": "Weitere Informationen:",
            "wertgarantieFurtherInfo": "Mehr zur Wertgarantie",
            "showDetailsText": "Details anzeigen",
            "hideDetailsText": "Details ausblenden",
            "cancelButtonText": "Nein, danke",
            "confirmButtonText": "Versicherung hinzufügen",
            "productTexts": {
                "paymentIntervals": paymentIntervals,
                "taxInformation": "(inkl. %s VerSt**)"
            },
            "documents": documents
        }
    },
    "landingpage": {
        "de": {}
    },
    "confirmation": {
        "de": {
            "productTexts": {
                "paymentIntervals": paymentIntervals,
                "taxInformation": "(inkl. %s VerSt**)"
            },
            "documents": documents
        }
    },
    "rating": {
        "de": {}
    },
    "aftersales": {
        "de": {}
    }
};

