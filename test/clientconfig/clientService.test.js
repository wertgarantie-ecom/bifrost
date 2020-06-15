const clientService = require('../../src/clientconfig/clientService');
const documentTypes = require('../../src/documents/documentTypes').documentTypes;
const uuid = require('uuid');

const mockClientRepository = {
    insert: _ => _
}

const mockTextService = {
    addDefaultTextsForAllComponents: () => "voll kuhl"
};

const mockProductOffersAssembler = {
    updateAllProductOffersForClient: _ => _
}

test('should create client with valid offers config', async () => {
    const data = {
        name: "testclient",
        backends: {
            webservices: {
                username: "webservices-testuser",
                password: "webservices-testpassword",
                productOffersConfigurations: [
                    {
                        name: "Komplettschutz",
                        productType: "KOMPLETTSCHUTZ_2019",
                        applicationCode: "GU WG DE KS 0419",
                        basicRiskType: "KOMPLETTSCHUTZ",
                        defaultPaymentInterval: "monthly",
                        priceRanges: [
                            {
                                minClose: 0,
                                maxOpen: 300
                            },
                            {
                                minClose: 300,
                                maxOpen: 800
                            },
                            {
                                minClose: 800,
                                maxOpen: 1800
                            }
                        ],
                        deviceClasses: [
                            {
                                objectCode: "9025",
                                objectCodeExternal: "Smartphone",
                            }
                        ],
                        documents: {
                            legalDocuments: [
                                documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION
                            ]
                        },
                        advantages: [],
                        risks: []
                    }
                ]
            }
        },
        publicClientIds: [
            "public:" + uuid()
        ],
        secrets: [
            "secret:" + uuid()
        ],
        basicAuthUser: "test",
        basicAuthPassword: "test"
    };
    const newClient = await clientService.addNewClient(data, mockClientRepository, mockTextService, mockProductOffersAssembler);

    expect(newClient.productOffersConfigurations).toEqual(data.productOffersConfigurations);
});

test('should create basic auth credentials if none were given', async () => {
    const data = {
        name: "testclient"
    }

    const client = await clientService.addNewClient(data, mockClientRepository, mockTextService, mockProductOffersAssembler);
    expect(client.basicAuthPassword).not.toEqual(undefined);
    expect(client.basicAuthUser).not.toEqual(undefined);
});

test('should reject client with invalid offers config', async () => {
    const data = {
        name: "testclient",
        backends: {
            webservices: {
                productOffersConfigurations: [{
                    "bla": "bla bla"
                }]
            }
        },
        publicClientIds: [
            "public:" + uuid()
        ],
        secrets: [
            "secret:" + uuid()
        ],
        basicAuthUser: "test",
        basicAuthPassword: "test"
    };

    try {
        await clientService.addNewClient(data);
        fail();
    } catch (error) {
        console.log(error);
        // should throw an error
    }
});