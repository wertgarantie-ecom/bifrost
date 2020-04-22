const {create} = require('xmlbuilder2');
const dateformat = require('dateformat');
const uuid = require('uuid');

exports.sendInsuranceProposal = async function sendInsuranceProposal(wertgarantieProduct, customer, matchingShopProduct, clientConfig) {
    // hole contract number
    // generiere Satznummer (möglicher Identifier auf unserer Seite?)
    // hole productoffer für wertgarantieProductId
    // Wertgarantie Object Code ermitteln
    // erstelle SET XML INTERFACE XML
    const insuranceProposalXML = getInsuranceProposalXML();

    // Response zusammenbauen
};
const customer = {
    company: "INNOQ",
    salutation: "Herr",
    firstname: "Max",
    lastname: "Mustermann",
    street: "Unter den Linden",
    zip: "52345",
    city: "Köln",
    country: "Deutschland",
    email: "max.mustermann1234@test.com"
};

function getInsuranceProposalXML(contractNumber, satznummer, activePartnerNumber, customer, shopProduct, objectCode, productOffer) {
    const date = dateformat(new Date(), 'dd.mm.yyyy');
    const proposalJson = {
        "Antraege": {
            "Herkunft": "WG_E-COMMERCE_COMPONENTS",
            "Exportdatum": date,
            "Antrag": {
                "Vertragsnummer": contractNumber,
                "Satznummer": satznummer,
                "Antragsdatum": date,
                "Vermittlernummer": activePartnerNumber,
                "Kundendaten": {
                    "Anrede": customer.salutation,
                    "Vorname": customer.firstname,
                    "Nachname": customer.lastname,
                    "Anschrift": {
                        "Strasse": customer.street,
                        "PLZ": customer.zip,
                        "Ort": customer.city
                    }
                },
                "Geraet": {
                    "Hersteller": shopProduct.manufacturer,
                    "Geraetekennzeichen": objectCode,
                    "Kaufdatum": date,
                    "Kaufpreis": ((shopProduct.devicePrice / 100) + "").replace(".", ",")
                },
                "ProduktDetails": {
                    "Antragskodierung": productOffer.applicationCode,
                    "Produkttyp": productOffer.productType
                }
            }
        }
    };
    return create(proposalJson).end();
}

exports.getInsuranceProposalXML = getInsuranceProposalXML;