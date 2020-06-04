const documents = {
    "PIS": "Produktinformationsblatt",
    "IPID": "Informationsblatt für Versicherungsprodukte",
    "GTCI": "Allgemeine Versicherungsbedingungen",
    "ROW": "Widerrufsrecht",
    "GDPR": "Datenschutz"
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
            "title": "Vergessen Sie nicht Ihren Wertgarantie Rundumschutz",
            "subtitle": "Wählen Sie die Versicherung aus, die Ihnen zusagt",
            "footerHtml": "Versicherung ist Vertrauenssache, deshalb setzt %s neben <strong>500.000 zufriedener Kunden</strong> auf die <strong>Wertgarantie</strong>, den <strong>Testsieger in Sachen Sicherheit</strong>",
            "partnerShop": "Testshop",
            "detailsHeader": "Weitere Vorteile:",
            "furtherInformation": "Weitere Informationen:",
            "wertgarantieFurtherInfoHtml": "Mehr zur <a target=\"_blank\" href=\"%s\">Wertgarantie</a>",
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
            "boxTitle": "Versicherung",
            "title": "Glückwunsch! Dieser Einkauf wird bestens abgesichert",
            "subtitle": "Bitte bestätige noch kurz:",
            "priceChanged": "Der Preis deiner Versicherung hat sich geändert!",
            "confirmationTextTermsAndConditions": "Ich akzeptiere die Allgemeinen Versicherungsbedingungen <a target=\"_blank\" href=\"%s\">(AVB)</a> und die Bestimmungen zum <a target=\"_blank\" href=\"%s\">Datenschutz</a>. Das gesetzliche <a target=\"_blank\" href=\"%s\">Widerrufsrecht</a> und das Produktinformationsblatt <a target=\"_blank\" href=\"%s\">(IPID)</a> habe ich zur Kenntnis genommen und alle Dokumente heruntergeladen. Mit der Bestätigung der Checkbox erkläre ich mich damit einverstanden, dass mir alle vorstehenden Unterlagen an meine E-Mail-Adresse übermittelt werden. Der Übertragung der erforderlichen Daten zur Übermittlung meines Versicherungsantrages an die WERTGARANTIE AG per E-Mail stimme ich zu. Der Betrag wird separat per Rechnung bezahlt.",
            "confirmationTextLock": "Ich bestätige, dass ich ein WERTGARANTIE konformes Schloss (Schlosspreis mindestens %s) nutzen werde.",
            "confirmationPrompt": "Bitte bestätige die oben stehenden Bedingungen um fortzufahren.",
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
        "de": {
            "success": {
                "title": "Länger Freude am Einkauf",
                "subtitle": "Folgende Geräte werden übermittelt",
                "contractNumber": "Auftragsnummer:",
                "nextStepsTitle": "Die nächsten Schritte",
                "nextSteps": ["E-Mail-Postfach überprüfen", "Mit wenigen Schritten absichern", "Sofortige Hilfe erhalten, wenn es zählt"]
            }
        }
    }
};

