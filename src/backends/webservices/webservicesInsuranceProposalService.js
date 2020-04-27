const {create} = require('xmlbuilder2');
const dateformat = require('dateformat');
const uuid = require('uuid');
const _webservicesClient = require('./webservicesClient');
const _productOffersRepository = require('./webserviceProductOffersRepository');
const _ = require('lodash');

exports.submitInsuranceProposal = async function submitInsuranceProposal(wertgarantieProduct, customer, matchingShopProduct, clientConfig, webservicesClient = _webservicesClient, productOffersRepository = _productOffersRepository, idGenerator = uuid) {
    const session = await webservicesClient.login(clientConfig);
    const contractnumber = await webservicesClient.getNewContractNumber(session);
    const satznummer = idGenerator();
    const productOffersForClient = productOffersRepository.findByClientId(clientConfig.id);
    const productOffer = _.find(productOffersForClient, productOffer => productOffer.id === wertgarantieProduct.wertgarantieProductId);
    const insuranceProposalXML = getInsuranceProposalXML(contractnumber, satznummer, clientConfig.activePartnerNumber, customer, matchingShopProduct, productOffer);
    const submitResult = await webservicesClient.sendInsuranceProposal(session, insuranceProposalXML);
    return {
        success: true,
        message: "successfully transmitted insurance proposal",
        contractNumber: contractnumber,
        transactionNumber: satznummer,
        resultCode: submitResult.STATUS_TEXT
    };
};

function getInsuranceProposalXML(contractNumber, satznummer, activePartnerNumber, customer, shopProduct, productOffer, date = new Date()) {
    function findObjectCode(externalObjectCode, productOffer) {
        return _.find(productOffer.devices, device => device.objectCodeExternal === externalObjectCode).objectCode;
    }

    const formattedDate = dateformat(date, 'dd.mm.yyyy');
    const objectCode = findObjectCode(shopProduct.deviceClass, productOffer);
    const proposalJson = {
        "Antraege": {
            "Herkunft": "WG_E-COMMERCE_COMPONENTS",
            "Exportdatum": formattedDate,
            "Antrag": {
                "Vertragsnummer": contractNumber,
                "Satznummer": satznummer,
                "Antragsdatum": formattedDate,
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
                    "Geraetetyp": objectCode,
                    "Kaufdatum": formattedDate,
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