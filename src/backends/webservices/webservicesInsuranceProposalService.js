const {create} = require('xmlbuilder2');
const dateformat = require('dateformat');
const uuid = require('uuid');
const _webservicesClient = require('./webservicesClient');
const _productOffersRepository = require('../../productoffers/productOffersRepository');
const _ = require('lodash');

exports.submitInsuranceProposal = async function submitInsuranceProposal(wertgarantieProduct, customer, matchingShopProduct, clientConfig, webservicesClient = _webservicesClient, productOffersRepository = _productOffersRepository, satznummerGenerator = uuid) {
    const session = await webservicesClient.login(clientConfig);
    const contractnumber = await webservicesClient.getNewContractNumber(session);
    const satznummer = satznummerGenerator();
    // hole productoffer für wertgarantieProductId
    const productOffersForClient = productOffersRepository.findByClientId(clientConfig.id);
    const productOffer = _.find(productOffersForClient, productOffer => productOffer.id === wertgarantieProduct.wertgarantieProductId);

    // Wertgarantie Object Code ermitteln --> Ne, wir können Mapping nutzen: http://www.wertgarantie.de/XMLSchema/sst_antrag/ --> AntragKommunikation
    // erstelle SET XML INTERFACE XML
    const insuranceProposalXML = getInsuranceProposalXML(contractnumber, satznummer, clientConfig.activePartnerNumber, customer, matchingShopProduct, productOffer);

    const submitResult = await webservicesClient.sendInsuranceProposal(session, insuranceProposalXML);

    return {
        contractnumber: contractnumber,
        satznummer: satznummer,
        statusCode: submitResult.STATUS_TEXT,
        webservicesMessage: submitResult.STATUS_CODE
    }
};

function getInsuranceProposalXML(contractNumber, satznummer, activePartnerNumber, customer, shopProduct, productOffer) {
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
                "Kommunikation": {
                    "Position": 1,
                    "Hersteller": shopProduct.manufacturer,
                    "Mapping": "TEST_KUNDE",
                    "Geraetetyp": shopProduct.deviceClass,
                    "Kaufdatum": date,
                    "Kaufpreis": ((shopProduct.price / 100) + "").replace(".", ","),
                    "Risiken": {
                        "Risiko": productOffer.risks.map(risk => {
                            return {
                                "Risikotyp": risk
                            }
                        })
                    }
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