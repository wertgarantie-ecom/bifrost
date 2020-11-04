const moment = require('moment');
const dateformat = require("dateformat");

const proposalType = {
    ce: {
        name: "Geraet",
        proposal: ceSpecificProposal
    },
    smartphone: {
        name: "Kommunikation",
        proposal: smartphoneSpecificProposal
    },
    bike: {
        name: "Rad",
        proposal: bikeSpecificProposal
    }
}

const deviceClassesConfig = {
    25: {
        proposalType: proposalType.ce,
        description: "Blu-Ray Gerät"
    },
    26: {
        proposalType: proposalType.ce,
        description: "E-Reader"
    },
    27: {
        proposalType: proposalType.bike,
        description: "Fahrrad"
    },
    29: {
        proposalType: proposalType.ce,
        description: "Haartrockner"
    },
    30: {
        proposalType: proposalType.ce,
        description: "Notebook"
    },
    31: {
        proposalType: proposalType.ce,
        description: "PC System"
    },
    32: {
        proposalType: proposalType.ce,
        description: "TV / Decoder"
    },
    35: {
        proposalType: proposalType.ce,
        description: "Multimedia Center"
    },
    37: {
        proposalType: proposalType.ce,
        description: "Navigationsgerät"
    },
    38: {
        proposalType: proposalType.ce,
        description: "Rasierapparat"
    },
    39: {
        proposalType: proposalType.ce,
        description: "Staubsauger"
    },
    40: {
        proposalType: proposalType.ce,
        description: "Abzugshaube"
    },
    41: {
        proposalType: proposalType.ce,
        description: "Backofen"
    },
    42: {
        proposalType: proposalType.ce,
        description: "Dampfbackofen"
    },
    44: {
        proposalType: proposalType.ce,
        description: "Stihl-Geräte"
    },
    45: {
        proposalType: proposalType.ce,
        description: "Dampfgarofen"
    },
    47: {
        proposalType: proposalType.ce,
        description: "Fax-Geräte"
    },
    48: {
        proposalType: proposalType.ce,
        description: "Fat-Gerät"
    },
    49: {
        proposalType: proposalType.ce,
        description: "Sammeltarif"
    },
    50: {
        proposalType: proposalType.ce,
        description: "Waschmaschine"
    },
    51: {
        proposalType: proposalType.ce,
        description: "Wäschetrockner"
    },
    52: {
        proposalType: proposalType.ce,
        description: "Geschirrspühler"
    },
    53: {
        proposalType: proposalType.ce,
        description: "TV"
    },
    54: {
        proposalType: proposalType.ce,
        description: "Video"
    },
    55: {
        proposalType: proposalType.ce,
        description: "SAT-Anlage"
    },
    56: {
        proposalType: proposalType.ce,
        description: "Camcorder"
    },
    57: {
        proposalType: proposalType.ce,
        description: "HiFi"
    },
    58: {
        proposalType: proposalType.ce,
        description: "Elektroherd"
    },
    59: {
        proposalType: proposalType.ce,
        description: "Computer"
    },
    60: {
        proposalType: proposalType.ce,
        description: "Kamera und Zubehör"
    },
    61: {
        proposalType: proposalType.ce,
        description: "Kaffee-/Espressomaschine"
    },
    62: {
        proposalType: proposalType.ce,
        description: "Rückprojektionsgerät"
    },
    63: {
        proposalType: proposalType.ce,
        description: "LCD/LED-TV"
    },
    64: {
        proposalType: proposalType.ce,
        description: "ISDN-/Telefonanlage"
    },
    65: {
        proposalType: proposalType.ce,
        description: "Plasma-TV"
    },
    66: {
        proposalType: proposalType.ce,
        description: "TV + Anschlussgerät"
    },
    67: {
        proposalType: proposalType.ce,
        description: "DVD/HD-Recorder"
    },
    68: {
        proposalType: proposalType.ce,
        description: "DVD-Anlage"
    },
    69: {
        proposalType: proposalType.ce,
        description: "Video/DVD Kombi"
    },
    70: {
        proposalType: proposalType.ce,
        description: "Auto-HiFi"
    },
    71: {
        proposalType: proposalType.ce,
        description: "Kühlschrank"
    },
    72: {
        proposalType: proposalType.ce,
        description: "Festnetztelefon"
    },
    73: {
        proposalType: proposalType.smartphone,
        description: "Mobilfunk"
    },
    74: {
        proposalType: proposalType.ce,
        description: "Gefrierschrank"
    },
    75: {
        proposalType: proposalType.ce,
        description: "Gasherd"
    },
    76: {
        proposalType: proposalType.ce,
        description: "Mikrowelle"
    },
    77: {
        proposalType: proposalType.ce,
        description: "DVD-Player"
    },
    78: {
        proposalType: proposalType.ce,
        description: "Waschtrockner"
    },
    79: {
        proposalType: proposalType.ce,
        description: "Schleuder"
    },
    80: {
        proposalType: proposalType.ce,
        description: "Gefriertruhe"
    },
    81: {
        proposalType: proposalType.ce,
        description: "Kühl-Gefrierkombi"
    },
    87: {
        proposalType: proposalType.ce,
        description: "Hörgerätezubehör"
    },
    88: {
        proposalType: proposalType.ce,
        description: "Bügelstation"
    },
    89: {
        proposalType: proposalType.ce,
        description: "Digital-Receiver"
    },
    90: {
        proposalType: proposalType.ce,
        description: "Hörgerät"
    },
    91: {
        proposalType: proposalType.ce,
        description: "Monitor"
    },
    92: {
        proposalType: proposalType.ce,
        description: "Photo-CD"
    },
    93: {
        proposalType: proposalType.ce,
        description: "CD-i-Player"
    },
    94: {
        proposalType: proposalType.ce,
        description: "Premium debitel Mobilfunk"
    },
    95: {
        proposalType: proposalType.ce,
        description: "TV/Humax Receiver"
    },
    97: {
        proposalType: proposalType.ce,
        description: "Tablet-Computer"
    },
    98: {
        proposalType: proposalType.ce,
        description: "Klimaanlage"
    },
    112: {
        proposalType: proposalType.ce,
        description: "Kühl-Kombi (x Geräte)"
    },
    113: {
        proposalType: proposalType.ce,
        description: "Herd-Kombi (mit Komponenten)"
    },
    114: {
        proposalType: proposalType.ce,
        description: "Soundbar/Playbar"
    },
    115: {
        proposalType: proposalType.ce,
        description: "Haushaltselektronikkleingeräte"
    },
    8704: {
        proposalType: proposalType.ce,
        description: "Gaggenau Sondergerät"
    },
    9025: {
        proposalType: proposalType.smartphone,
        description: "Smartphone"
    },
    9026: {
        proposalType: proposalType.smartphone,
        description: "Smartwatch"
    },
    9031: {
        proposalType: proposalType.ce,
        description: "Smart Home System"
    },
    9032: {
        proposalType: proposalType.ce,
        description: "Smart Home Server"
    },
    9033: {
        proposalType: proposalType.ce,
        description: "Smart Home Komponente"
    },
    490128: {
        proposalType: proposalType.ce,
        description: "Drucker"
    },
    270009: {
        proposalType: proposalType.bike,
        description: "E-Bike"
    }
}


exports.getInsuranceProposalSpecifics = function getInsuranceProposalSpecifics(antrag, objectCode, shopProduct, formattedDate, productOffer, condition) {
    const config = deviceClassesConfig[objectCode];
    if (config) {
        const proposalType = config.proposalType;
        return antrag[proposalType.name] = proposalType.proposal(objectCode, shopProduct, formattedDate, productOffer, condition);
    } else {
        throw new Error(`Object Code ${objectCode} does not match a specific proposal.`)
    }
};


function smartphoneSpecificProposal(objectCode, shopProduct, formattedDate, productOffer, condition) {
    return {
        ...bikeSpecificProposal(objectCode, shopProduct, formattedDate, productOffer, condition),
        "Modellbezeichnung": shopProduct.name
    };
}

function ceSpecificProposal(objectCode, shopProduct, formattedDate, productOffer) {
    return smartphoneSpecificProposal(objectCode, shopProduct, formattedDate, productOffer);
}

function bikeSpecificProposal(objectCode, shopProduct, formattedDate, productOffer, condition) {
    return {
        "Position": 1,
        "Hersteller": shopProduct.manufacturer,
        "Geraetekennzeichen": objectCode,
        "Kaufdatum": formattedDate,
        ...conditionBasedAttributes(shopProduct.price, condition),
        "Risiken": {
            "Risiko": productOffer.risks.map(risk => {
                return {
                    "Risikotyp": risk
                }
            })
        }
    };
}

function conditionBasedAttributes(price, condition) {
    const kaufpreis = ((price / 100) + "").replace(".", ",");
    if (condition === "USED") {
        return {
            "Baujahr": getUsedDate(),
            "GebrauchtGeraet": true,
            "Kaufpreis": kaufpreis
        }
    } else {
        return {
            "Kaufpreis": kaufpreis,
        }
    }
}

function getUsedDate() {
    const usedDate = moment().subtract(1, "years").subtract(1, "days").toDate();
    return dateformat(usedDate, 'dd.mm.yyyy');
}
