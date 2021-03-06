const clientRepository = require('../../src/clientconfig/clientRepository');
const documentTypes = require('../../src/documents/documentTypes').documentTypes;
const uuid = require('uuid');

describe("should find persisted client properties by given secret", () => {

    const clientData = {
        id: uuid(),
        name: "bikeShop",
        email: "mymail@mail.mu",
        backends: {
            webservices: {
                username: "webserviceUser",
                password: "webservicePassword"
            },
        },
        activePartnerNumber: 1234,
        secrets: [
            "secret:" + uuid()
        ],
        publicClientIds: [
            "public:" + uuid()
        ],
        basicAuthUser: "test",
        basicAuthPassword: "test",
        handbook: {
            features: [
                "SHOPPING_CART_SYNC"
            ],
            components: {
                popupselection: {
                    "samples": []
                },
                confirmation: {
                    "samples": []
                },
                aftersales: {
                    "samples": []
                }
            }
        }
    };


    test("should persist valid client data", async () => {
        const persistResult = await clientRepository.insert(clientData);
        expect(persistResult).toEqual(clientData);
    });

    test("should find persisted client data by given secret", async () => {
        const client = await clientRepository.findClientForSecret(clientData.secrets[0]);
        expect(client).toEqual(clientData);
    });
});

describe("should find persisted client properties by given public client id", () => {

    const clientData = {
        id: uuid(),
        name: "bikeShop",
        backends: {
            webservices: {
                username: "webserviceUser",
                password: "webservicePassword"
            },
        },
        activePartnerNumber: 1234,
        secrets: [
            "secret:" + uuid()
        ],
        publicClientIds: [
            "public:" + uuid()
        ],
        basicAuthUser: "test",
        basicAuthPassword: "test"
    };

    test("should persist valid client data", async () => {
        await clientRepository.insert(clientData);
    });

    test("should find persisted client data by given public id", async () => {
        const client = await clientRepository.findClientForPublicClientId(clientData.publicClientIds[0]);
        expect(client).toEqual(clientData);
    })
});

describe("should delete client data for client id", () => {

    const clientData = {
        id: uuid(),
        name: "bikeShop",
        backends: {
            webservices: {
                username: "webserviceUser",
                password: "webservicePassword"
            },
        },
        activePartnerNumber: 1234,
        secrets: ["secret:" + uuid(), "secret:" + uuid()].sort(),
        publicClientIds: ["public:" + uuid(), "public:" + uuid()].sort(),
        basicAuthUser: "test1",
        basicAuthPassword: "test1"
    };

    test("should persist valid client data", async () => {
        await clientRepository.insert(clientData);
    });

    test("could find persisted data", async () => {
        const client = await clientRepository.findClientById(clientData.id);
        expect(client).toEqual(clientData);
    });

    test("should delete persisted client data by given id", async () => {
        const isDeleted = await clientRepository.deleteClientById(clientData.id);
        expect(isDeleted).toEqual(true);
    });

    test("can not retrieve now deleted data", async () => {
        const client = await clientRepository.findClientById(clientData.id);
        expect(client).toEqual(undefined);
    });
});

describe("should handle client config for product offers", () => {
    const clientData = {
        id: uuid(),
        name: "bikeShop",
        backends: {
            webservices: {
                username: "webserviceUser",
                password: "webservicePassword",
                productOffersConfigurations: [
                    {
                        name: "Komplettschutz",
                        productType: "KOMPLETTSCHUTZ_2019",
                        applicationCode: "GU WG DE KS 0419",
                        basicRiskType: "KOMPLETTSCHUTZ",
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
                                objectCodeExternal: "Smartphone"
                            },
                            {
                                objectCode: "73",
                                objectCodeExternal: "Mobilfunk"
                            }

                        ],
                        documentTypes: {
                            legalDocuments: [
                                {
                                    type: documentTypes.LEGAL_NOTICE,
                                    pattern: 'GU WG DE KS 0419_RECHTSDOKUMENTE.PDF'
                                }
                            ]
                        },
                        advantages: [],
                        risks: []
                    }
                ]
            },
        },
        activePartnerNumber: 1234,
        secrets: ["secret:" + uuid(), "secret:" + uuid()].sort(),
        publicClientIds: ["public:" + uuid(), "public:" + uuid()].sort(),
        basicAuthUser: "test2",
        basicAuthPassword: "test2"
    };
    test("persist and retrieve product offers config for client", async () => {
        const persistResult = await clientRepository.insert(clientData);
        expect(persistResult).toEqual(clientData);
    });

    test("should find client by username", async () => {
        const clientByUsername = await clientRepository.findByUsername("test2");
        expect(clientByUsername).toEqual(clientData);
    });

});

describe("should update client config", () => {
    const clientData = {
        id: uuid(),
        name: "bikeShop",
        backends: {
            webservices: {
                username: "webserviceUser",
                password: "webservicePassword",
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
                            },
                            {
                                objectCode: "73",
                                objectCodeExternal: "Mobilfunk",
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
                        documentTypes: {
                            legalDocuments: [
                                {
                                    type: documentTypes.LEGAL_NOTICE,
                                    pattern: 'GU WG DE KS 0419_RECHTSDOKUMENTE.PDF'
                                }
                            ]
                        },
                        advantages: [],
                        risks: []
                    }
                ]
            },
        },
        activePartnerNumber: 1234,
        secrets: ["secret:" + uuid(), "secret:" + uuid()].sort(),
        publicClientIds: ["public:" + uuid(), "public:" + uuid()].sort(),
        basicAuthUser: "test2",
        basicAuthPassword: "test2"
    };
    test("persist and retrieve product offers config for client", async () => {
        const persistResult = await clientRepository.insert(clientData);
        expect(persistResult).toEqual(clientData);
    });

    test("should update client config", async () => {
        clientData.activePartnerNumber = 54321;
        const updatedClient = await clientRepository.update(clientData);
        expect(updatedClient.activePartnerNumber).toEqual(54321);
    });

});