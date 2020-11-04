const {create} = require('xmlbuilder2');
const dateformat = require('dateformat');
const uuid = require('uuid');
const _webservicesClient = require('./webservicesClient');
const _productOffersRepository = require('./webserviceProductOffersRepository');
const getInsuranceProposalSpecifics = require('./webservicesInsuranceProposalSpecificsService').getInsuranceProposalSpecifics;
const _ = require('lodash');

exports.submitInsuranceProposal = async function submitInsuranceProposal(order, customer, matchingShopProduct, clientConfig, webservicesClient = _webservicesClient, productOffersRepository = _productOffersRepository, idGenerator = uuid) {
    try {
        const session = await webservicesClient.login(clientConfig.backends.webservices);
        const contractnumber = await webservicesClient.getNewContractNumber(session);
        const satznummer = idGenerator();
        const productOffersForClient = await productOffersRepository.findByClientId(clientConfig.id);
        const productOffer = _.find(productOffersForClient, productOffer => productOffer.id === order.wertgarantieProduct.id);
        if (!productOffer) {
            throw new Error("No product offer for wertgarantie product id " + order.wertgarantieProduct.id);
        }
        const insuranceProposalXML = getInsuranceProposalXML(contractnumber, satznummer, clientConfig.activePartnerNumber, customer, matchingShopProduct, productOffer, order.wertgarantieProduct.deviceClass, order.wertgarantieProduct.shopProductCondition);

        const submitResult = await webservicesClient.sendInsuranceProposal(session, insuranceProposalXML);

        return {
            success: true,
            message: "successfully transmitted insurance proposal",
            contractNumber: contractnumber,
            transactionNumber: satznummer,
            backend: "webservices",
            backendResponseInfo: {
                statusText: submitResult.RESULT.STATUS_TEXT,
                statusCode: submitResult.RESULT.STATUS_CODE,
                requestId: submitResult.REQUEST_ID
            },
            productImageLink: productOffer.productImageLink,
            backgroundStyle: productOffer.backgroundStyle
        };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: e.message,
            backend: "webservices",
        };
    }
};

function getInsuranceProposalXML(contractNumber, satznummer, activePartnerNumber, customer, shopProduct, productOffer, deviceClass, date = new Date(), condition) {
    const formattedDate = dateformat(date, 'dd.mm.yyyy');
    const proposal = {
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
        }
    };
    getInsuranceProposalSpecifics(proposal, deviceClass, shopProduct, formattedDate, productOffer, condition);
    proposal["Produktdetails"] = {
        "Antragskodierung": productOffer.applicationCode,
        "Produkttyp": productOffer.productType
    };
    proposal["Zahlung"] = {
        "Selbstzahler": true
    };

    const proposalJsonComplete = {
        "Antraege": {
            "Herkunft": "WG_E-COMMERCE_COMPONENTS",
            "Exportdatum": formattedDate,
            "Antrag": proposal
        }
    };
    return create(proposalJsonComplete).end();
}

exports.getInsuranceProposalXML = getInsuranceProposalXML;