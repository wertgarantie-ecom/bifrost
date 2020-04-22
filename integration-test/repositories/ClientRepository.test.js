const clientRepository = require('../../src/clientconfig/ClientRepository');
const documentTypes = require('../../src/documents/documentTypes').documentTypes;
const uuid = require('uuid');

describe("should find persisted client properties by given secret", () => {

    const clientData = {
        id: uuid(),
        name: "bikeShop",
        heimdallClientId: uuid(),
        webservices: {
            username: "webserviceUser",
            password: "webservicePassword"
        },
        activePartnerNumber: 1234,
        secrets: [
            "secret:" + uuid()
        ],
        publicClientIds: [
            "public:" + uuid()
        ]
    };


    test("should persist valid client data", async () => {
        const persistResult = await clientRepository.persist(clientData);
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
        heimdallClientId: uuid(),
        webservices: {
            username: "webserviceUser",
            password: "webservicePassword"
        },
        activePartnerNumber: 1234,
        secrets: [
            "secret:" + uuid()
        ],
        publicClientIds: [
            "public:" + uuid()
        ]
    };

    test("should persist valid client data", async () => {
        await clientRepository.persist(clientData);
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
        heimdallClientId: uuid(),
        webservices: {
            username: "webserviceUser",
            password: "webservicePassword"
        },
        activePartnerNumber: 1234,
        secrets: ["secret:" + uuid(), "secret:" + uuid()].sort(),
        publicClientIds: ["public:" + uuid(), "public:" + uuid()].sort()
    };

    test("should persist valid client data", async () => {
        await clientRepository.persist(clientData);
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
           heimdallClientId: uuid(),
           webservices: {
               username: "webserviceUser",
               password: "webservicePassword"
           },
           activePartnerNumber: 1234,
           secrets: ["secret:" + uuid(), "secret:" + uuid()].sort(),
           publicClientIds: ["public:" + uuid(), "public:" + uuid()].sort(),
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
                       ],
                       comparisonDocuments: []
                   },
                   advantages: [],
                   risks: []
               }
           ]
       };
   test("persist and retrieve product offers config for client", async () => {
       const persistResult = await clientRepository.persist(clientData);
       expect(persistResult).toEqual(clientData);
   });
});