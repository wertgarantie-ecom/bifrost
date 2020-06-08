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
        const insuranceProposalXML = getInsuranceProposalXML(contractnumber, satznummer, clientConfig.activePartnerNumber, customer, matchingShopProduct, productOffer);

        const submitResult = await webservicesClient.sendInsuranceProposal(session, insuranceProposalXML);

        return {
            id: idGenerator(),
            wertgarantieProductId: order.wertgarantieProduct.id,
            wertgarantieProductName: order.wertgarantieProduct.name,
            deviceClass: order.shopProduct.deviceClass,
            devicePrice: order.shopProduct.price,
            orderItemId: matchingShopProduct.orderItemId,
            success: true,
            message: "successfully transmitted insurance proposal",
            shopProduct: order.shopProduct.name,
            contractNumber: contractnumber,
            transactionNumber: satznummer,
            backend: "webservices",
            backendResponseInfo: {
                statusText: submitResult.RESULT.STATUS_TEXT,
                statusCode: submitResult.RESULT.STATUS_CODE,
                requestId: submitResult.REQUEST_ID
            }
        };
    } catch (e) {
        console.error(e);
        return {
            id: idGenerator(),
            wertgarantieProductId: order.wertgarantieProduct.id,
            wertgarantieProductName: order.wertgarantieProduct.name,
            orderItemId: order.shopProduct.orderItemId,
            deviceClass: order.shopProduct.deviceClass,
            devicePrice: order.shopProduct.price,
            success: false,
            message: e.message,
            shopProduct: order.shopProduct.name,
            backend: "webservices",
        };
    }
};

function getInsuranceProposalXML(contractNumber, satznummer, activePartnerNumber, customer, shopProduct, productOffer, date = new Date()) {
    function findObjectCode(externalObjectCode, productOffer) {
        return _.find(productOffer.devices, device => device.objectCodeExternal === externalObjectCode).objectCode;
    }

    const formattedDate = dateformat(date, 'dd.mm.yyyy');
    const objectCode = findObjectCode(shopProduct.deviceClass, productOffer);
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
    getInsuranceProposalSpecifics(proposal, objectCode, shopProduct, formattedDate, productOffer);
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