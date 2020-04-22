const webservicesInsuranceProposalService = require('../../../src/backends/webservices/webservicesInsuranceProposalService');
const fixtureHelper = require('../../../integration-test/helper/fixtureHelper');
const testProductOffers = require('./dummyProductOffers');
const webservicesResponses = require('../../../integration-test/backends/webservices/webservicesResponses');

test("should return valid insurance proposal XML", () => {
    const productOffer = {
        productType: "KOMPLETTSCHUTZ_2019",
        applicationCode: "GU WG DE KS 0419",
        risks: ["KOMPLETTSCHUTZ", "DIEBSTAHLSCHUTZ"]
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
    const setXMLInterfaceXML = webservicesInsuranceProposalService.getInsuranceProposalXML("12345678", "87654321", "12345", customer, purchasedProduct, productOffer);
    console.log(setXMLInterfaceXML);
    expect(setXMLInterfaceXML).toEqual("<?xml version=\"1.0\"?><Antraege><Herkunft>WG_E-COMMERCE_COMPONENTS</Herkunft><Exportdatum>22.04.2020</Exportdatum><Antrag><Vertragsnummer>12345678</Vertragsnummer><Satznummer>87654321</Satznummer><Antragsdatum>22.04.2020</Antragsdatum><Vermittlernummer>12345</Vermittlernummer><Kundendaten><Anrede>Herr</Anrede><Vorname>Max</Vorname><Nachname>Mustermann</Nachname><Anschrift><Strasse>Unter den Linden</Strasse><PLZ>52345</PLZ><Ort>Köln</Ort></Anschrift></Kundendaten><Kommunikation><Position>1</Position><Hersteller>Super Phones Inc.</Hersteller><Mapping>TEST_KUNDE</Mapping><Geraetetyp>Smartphone</Geraetetyp><Kaufdatum>22.04.2020</Kaufdatum><Kaufpreis>1399,99</Kaufpreis><Risiken><Risiko><Risikotyp>KOMPLETTSCHUTZ</Risikotyp></Risiko><Risiko><Risikotyp>DIEBSTAHLSCHUTZ</Risikotyp></Risiko></Risiken></Kommunikation><ProduktDetails><Antragskodierung>GU WG DE KS 0419</Antragskodierung><Produkttyp>KOMPLETTSCHUTZ_2019</Produkttyp></ProduktDetails></Antrag></Antraege>");
});

test("should submit insurance proposal", async () => {
    const clientConfig = fixtureHelper.createDefaultClient();
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
    const mockWebservicesClient = {
        login: () => "session",
        getNewContractNumber: () => "12345678",
        sendInsuranceProposal: () => webservicesResponses.successfulInsuranceProposal.RESULT
    };

    const satznummerGenerator = () => "dd2209dc-fa26-444d-b1ce-2995b9340aac";

    const mockProductOffersRepository = {
        findByClientId: () => testProductOffers.completeAssembledProductOffers
    };

    const result = await webservicesInsuranceProposalService.submitInsuranceProposal(wertgarantieProduct, customer, purchasedProduct, clientConfig, mockWebservicesClient, mockProductOffersRepository, satznummerGenerator);
    expect(result).toEqual({
        contractnumber: "12345678",
        satznummer: "dd2209dc-fa26-444d-b1ce-2995b9340aac",
        statusCode: "Verarbeitet",
        webservicesMessage: "3"
    })
    console.log(result);
});