const clientService = require('../../src/clientconfig/clientService');
const documentTypes = require('../../src/documents/documentTypes').documentTypes;
const uuid = require('uuid');

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
                        deviceClasses: [
                            {
                                objectCode: "9025",
                                objectCodeExternal: "Smartphone",
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
                                ]
                            }
                        ],
                        documents: {
                            legalDocuments: [
                                documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE,
                                documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION
                            ],
                            comparisonDocuments: []
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
        credentials: {
            basicAuth: {
                username: "test",
                password: "test"
            }
        }
    };

    const repository = {
        insert: (client) => client
    };
    const clientComponentTextService = {
        addDefaultTextsForAllComponents: () => "voll kuhl"
    };
    const newClient = await clientService.addNewClient(data, repository, clientComponentTextService);

    expect(newClient.productOffersConfigurations).toEqual(data.productOffersConfigurations);
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
        credentials: {
            basicAuth: {
                username: "test",
                password: "test"
            }
        }
    };

    try {
        await clientService.addNewClient(data);
        fail();
    } catch (error) {
        console.log(error);
        // should throw an error
    }
});
