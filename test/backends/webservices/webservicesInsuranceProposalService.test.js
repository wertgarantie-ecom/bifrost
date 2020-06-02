const webservicesInsuranceProposalService = require('../../../src/backends/webservices/webservicesInsuranceProposalService');
const fixtureHelper = require('../../../integration-test/helper/fixtureHelper');
const testProductOffers = require('./dummyWebserviceProductOffers');
const webservicesResponses = require('../../../integration-test/backends/webservices/webservicesResponses');

test("should return valid insurance proposal XML", () => {
    const productOffer = {
        productType: "KOMPLETTSCHUTZ_2019",
        applicationCode: "GU WG DE KS 0419",
        risks: ["KOMPLETTSCHUTZ", "DIEBSTAHLSCHUTZ"],
        "devices": [
            {
                "intervals": [
                    {
                        "description": "monatlich",
                        "intervalCode": "1",
                        "priceRangePremiums": [
                            {
                                "minClose": 0,
                                "maxOpen": 30001,
                                "insurancePremium": 500
                            },
                            {
                                "minClose": 30001,
                                "maxOpen": 80001,
                                "insurancePremium": 800
                            },
                            {
                                "minClose": 80001,
                                "maxOpen": 180001,
                                "insurancePremium": 1100
                            }
                        ]
                    },
                ],
                "objectCode": "9025",
                "maxPriceLimitation": 180000,
                "objectCodeExternal": "Smartphone"
            }
        ]
    };
    const purchasedProduct = {
        price: 139999,
        manufacturer: "Super Phones Inc.",
        deviceClass: "Smartphone",
        model: "Smartphone 11x"
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
    const setXMLInterfaceXML = webservicesInsuranceProposalService.getInsuranceProposalXML("12345678", "87654321", "12345", customer, purchasedProduct, productOffer, new Date(2020, 3, 22));
    expect(setXMLInterfaceXML).toEqual("<?xml version=\"1.0\"?><Antraege><Herkunft>WG_E-COMMERCE_COMPONENTS</Herkunft><Exportdatum>22.04.2020</Exportdatum><Antrag><Vertragsnummer>12345678</Vertragsnummer><Satznummer>87654321</Satznummer><Antragsdatum>22.04.2020</Antragsdatum><Vermittlernummer>12345</Vermittlernummer><Kundendaten><Anrede>Herr</Anrede><Vorname>Max</Vorname><Nachname>Mustermann</Nachname><Anschrift><Strasse>Unter den Linden</Strasse><PLZ>52345</PLZ><Ort>Köln</Ort></Anschrift></Kundendaten><Kommunikation><Position>1</Position><Hersteller>Super Phones Inc.</Hersteller><Geraetekennzeichen>9025</Geraetekennzeichen><Modellbezeichnung>Smartphone 11x</Modellbezeichnung><Kaufdatum>22.04.2020</Kaufdatum><Kaufpreis>1399,99</Kaufpreis><Risiken><Risiko><Risikotyp>KOMPLETTSCHUTZ</Risikotyp></Risiko><Risiko><Risikotyp>DIEBSTAHLSCHUTZ</Risikotyp></Risiko></Risiken></Kommunikation><Produktdetails><Antragskodierung>GU WG DE KS 0419</Antragskodierung><Produkttyp>KOMPLETTSCHUTZ_2019</Produkttyp></Produktdetails><Zahlung><Selbstzahler>true</Selbstzahler></Zahlung></Antrag></Antraege>");
});

test("should submit insurance proposal", async () => {
    const clientConfig = fixtureHelper.createDefaultClient();
    const productOrder = {
        shopProduct: {
            deviceClass: "Smartphone",
            price: 139999,
            model: "Smartphone 11x"
        },
        wertgarantieProduct: {
            id: "bb91b2de-cbb9-49e8-a3a5-1b6e8296403d",
            name: "Komplettschutz",
            paymentInterval: "monthly"
        }
    };
    const purchasedProduct = {
        price: 139999,
        manufacturer: "Super Phones Inc.",
        deviceClass: "Smartphone",
        model: "Smartphone 11x"
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
    const mockWebservicesClient = {
        login: () => "session",
        getNewContractNumber: () => "12345678",
        sendInsuranceProposal: () => webservicesResponses.successfulInsuranceProposal
    };

    const satznummerGenerator = () => "dd2209dc-fa26-444d-b1ce-2995b9340aac";

    const mockWebservicesProductOffersRepository = {
        findByClientId: () => testProductOffers.completeWebserviceProductOffers
    };

    const result = await webservicesInsuranceProposalService.submitInsuranceProposal(productOrder, customer, purchasedProduct, clientConfig, mockWebservicesClient, mockWebservicesProductOffersRepository, satznummerGenerator);
    expect(result).toEqual({
        "backend": "webservices",
        "contractNumber": "12345678",
        "deviceClass": "Smartphone",
        "devicePrice": 139999,
        "id": "dd2209dc-fa26-444d-b1ce-2995b9340aac",
        "message": "successfully transmitted insurance proposal",
        "shopProduct": "Smartphone 11x",
        "success": true,
        "transactionNumber": "dd2209dc-fa26-444d-b1ce-2995b9340aac",
        "wertgarantieProductId": "bb91b2de-cbb9-49e8-a3a5-1b6e8296403d",
        "wertgarantieProductName": "Komplettschutz",
        "backendResponseInfo": {
            "statusText": "Verarbeitet",
            "statusCode": "3",
            "requestId": "98889510"
        }
    });
});


test.skip('execute vs webservices dev', async () => {
    process.env.WEBSERVICES_URI = "https://webtest.serviceeu.com/mdp/ws/dev";
    const clientConfig = {
        name: "testclient",
        backends: {
            heimdall: {
                clientId: "e4d3237c-7582-11ea-8602-9ba3368ccb31"
            },
            webservices: {
                username: "plz fill me",
                password: "plz fill me"
            },
        },
        publicClientIds: [
            "public:idontcare"
        ],
        secrets: [
            "secret:idontcare"
        ],
        activePartnerNumber: 1541890,
    };
    const wertgarantieProduct = {
        wertgarantieProductId: "bb91b2de-cbb9-49e8-a3a5-1b6e8296403d"
    };
    const purchasedProduct = {
        price: 139999,
        manufacturer: "Super Phones Inc.",
        deviceClass: "Smartphone",
        model: "Smartphone 11x"
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

    const satznummerGenerator = () => "dd2209dc-fa26-444d-b1ce-2995b9340aac";

    const mockWebservicesProductOffersRepository = {
        findByClientId: () => testProductOffers.completeWebserviceProductOffers
    };

    const result = await webservicesInsuranceProposalService.submitInsuranceProposal(wertgarantieProduct, customer, purchasedProduct, clientConfig, undefined, mockWebservicesProductOffersRepository, satznummerGenerator);

    expect(result.webservicesMessage).toEqual("3");
});