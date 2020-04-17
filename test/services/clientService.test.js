const clientService = require('../../src/services/clientService');
const documentTypes = require('../../src/services/documentTypes').documentTypes;
const uuid = require('uuid');

test('should create client with valid offers config', async () => {
    const data = {
        name: "testclient",
        publicClientIds: [
            "public:" + uuid()
        ],
        secrets: [
            "secret:" + uuid()
        ],
        productOffersConfigurations: [
            {
                name: "Komplettschutz",
                productType: "KOMPLETTSCHUTZ_2019",
                applicationCode: "GU WG DE KS 0419",
                basicRiskType: "KOMPLETTSCHUTZ",
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
                        {
                            type: documentTypes.LEGAL_NOTICE,
                            pattern: 'GU WG DE KS 0419_RECHTSDOKUMENTE.PDF'
                        }
                    ],
                    comparisonDocuments: []
                },
                advantages: [],
                risks: []
            }
        ]
    };

    const repository = {
        persist: (client) => client
    };
    const newClient = await clientService.addNewClient(data, repository);

    expect(newClient.productOffersConfigurations).toEqual(data.productOffersConfigurations);
});

test('should reject client with invalid offers config', async () => {
    const data = {
        name: "testclient",
        publicClientIds: [
            "public:" + uuid()
        ],
        secrets: [
            "secret:" + uuid()
        ],
        productOffersConfigurations: [{
            "bla": "bla bla"
        }]
    };

    try {
        await clientService.addNewClient(data);
        fail();
    } catch (error) {
        console.log(error);
        // should throw an error
    }
});
