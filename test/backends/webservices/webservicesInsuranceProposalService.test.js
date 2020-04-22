const webservicesInsuranceProposalService = require('../../../src/backends/webservices/webservicesInsuranceProposalService');

test("sould return valid insurance proposal XML", () => {
    const productOffer = {
        productType: "KOMPLETTSCHUTZ_2019",
        applicationCode: "GU WG DE KS 0419"
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
    const setXMLInterfaceXML = webservicesInsuranceProposalService.getInsuranceProposalXML("12345678", "87654321", "12345", customer, purchasedProduct, 9025, productOffer);
    expect(setXMLInterfaceXML).toEqual("<?xml version=\"1.0\"?><Antraege><Herkunft>WG_E-COMMERCE_COMPONENTS</Herkunft><Exportdatum>22.04.2020</Exportdatum><Antrag><Vertragsnummer>12345678</Vertragsnummer><Satznummer>87654321</Satznummer><Antragsdatum>22.04.2020</Antragsdatum><Vermittlernummer>12345</Vermittlernummer><Kundendaten><Anrede>Herr</Anrede><Vorname>Max</Vorname><Nachname>Mustermann</Nachname><Anschrift><Strasse>Unter den Linden</Strasse><PLZ>52345</PLZ><Ort>Köln</Ort></Anschrift></Kundendaten><Geraet><Hersteller>Super Phones Inc.</Hersteller><Geraetekennzeichen>9025</Geraetekennzeichen><Kaufdatum>22.04.2020</Kaufdatum><Kaufpreis>NaN</Kaufpreis></Geraet><ProduktDetails><Antragskodierung>GU WG DE KS 0419</Antragskodierung><Produkttyp>KOMPLETTSCHUTZ_2019</Produkttyp></ProduktDetails></Antrag></Antraege>");
});