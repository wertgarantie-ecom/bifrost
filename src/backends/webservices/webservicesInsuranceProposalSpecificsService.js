const UnknownInsuranceProposalError = require('./UnknownInsuranceProposalError');

const bikeProposal = {
    proposalName: "Rad",
    proposal: bikeSpecificProposal
};
const smartphoneProposal = {
    proposalName: "Kommunikation",
    proposal: smartphoneSpecificProposal
};
const objectCodeProposalMapping = {
    "9025": smartphoneProposal,
    "73": smartphoneProposal,
    "27": bikeProposal,
    "270001": bikeProposal,
    "270002": bikeProposal,
    "270003": bikeProposal,
    "270004": bikeProposal,
    "270005": bikeProposal,
    "270006": bikeProposal,
    "270007": bikeProposal,
    "270008": bikeProposal,
    "270009": bikeProposal,
    "270011": bikeProposal,
    "270012": bikeProposal,
    "270013": bikeProposal,
    "270014": bikeProposal,
    "270015": bikeProposal,
    "270016": bikeProposal,
    "270017": bikeProposal,
    "270018": bikeProposal,
    "490132": bikeProposal
};

exports.getInsuranceProposalSpecifics = function getInsuranceProposalSpecifics(antrag, objectCode, shopProduct, formattedDate, productOffer) {
    const proposalSpecifics = objectCodeProposalMapping[objectCode];
    if (proposalSpecifics) {
        antrag[proposalSpecifics.proposalName] = proposalSpecifics.proposal(objectCode, shopProduct, formattedDate, productOffer);
    } else {
        throw new UnknownInsuranceProposalError(`Object Code ${objectCode} does not match a specific proposal.`)
    }
};

function smartphoneSpecificProposal(objectCode, shopProduct, formattedDate, productOffer) {
    return {
        "Position": 1,
        "Hersteller": shopProduct.manufacturer,
        "Geraetekennzeichen": objectCode,
        "Kaufdatum": formattedDate,
        "Kaufpreis": ((shopProduct.price / 100) + "").replace(".", ","),
        "Risiken": {
            "Risiko": productOffer.risks.map(risk => {
                return {
                    "Risikotyp": risk
                }
            })
        }
    }
}

function bikeSpecificProposal(objectCode, shopProduct, formattedDate, productOffer) {
    return {
        "Position": 1,
        "Hersteller": shopProduct.manufacturer,
        "Geraetekennzeichen": objectCode,
        "Kaufdatum": formattedDate,
        "Kaufpreis": ((shopProduct.price / 100) + "").replace(".", ","),
        "Risiken": {
            "Risiko": productOffer.risks.map(risk => {
                return {
                    "Risikotyp": risk
                }
            })
        }
    };
}