const request = require('supertest');
const app = require('../../src/app').default;
const uuid = require('uuid');
const _ = require('lodash');
const fixtureHelper = require('../helper/fixtureHelper');

describe('should add new client with valid data', () => {
    let newClientId = undefined;
    const addNewClientRequest = {
        name: "test",
        backends: {
            webservices: {
                username: 'test-user',
                password: 'test-password',
                productOffersConfigurations: []
            },
        },
        activePartnerNumber: 12345
    };
    it('should add new client', async () => {
        return request(app)
            .post("/wertgarantie/clients")
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
            .set('Accept', 'application/json')
            .send(addNewClientRequest)
            .expect(200)
            .then(response => {
                const {id, name, secrets, publicClientIds, backends, activePartnerNumber} = response.body;
                newClientId = id;
                expect(addNewClientRequest.name).toEqual(name);
                expect(secrets.length).toBeGreaterThan(0);
                expect(publicClientIds.length).toBeGreaterThan(0);
                expect(addNewClientRequest.backends.webservices.username).toEqual(backends.webservices.username);
                expect(addNewClientRequest.backends.webservices.password).toEqual(backends.webservices.password);
                expect(addNewClientRequest.activePartnerNumber).toEqual(activePartnerNumber);
            });
    });

    it('should find all clients', async () => {
        return request(app)
            .get("/wertgarantie/clients")
            .set('Accept', 'application/json')
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
            .expect(200)
            .then(response => {
                const {clients} = response.body;
                const createdClient = _.find(clients, {id: newClientId});
                expect(createdClient).toBeDefined()
            });
    });

    it('should update webservices backend config', async () => {
        const newProductOffersConfig = fixtureHelper.createDefaultClientWithWebservicesConfiguration().backends.webservices.productOffersConfigurations;
        const newWebservicesConfig = {
            username: 'test-user-updated',
            password: 'test-password-updated',
            productOffersConfigurations: newProductOffersConfig
        };
        const updateResult = await request(app)
            .put(`/wertgarantie/clients/${newClientId}/backends/webservices`)
            .set('Accept', 'application/json')
            .send(newWebservicesConfig)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD);
        expect(updateResult.status).toBe(200);
        expect(updateResult.body.backends.webservices).toEqual(newWebservicesConfig);
    });

    it('should delete client', async () => {
        return await request(app)
            .delete(`/wertgarantie/clients/${newClientId}`)
            .set('Accept', 'application/json')
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
            .expect(200)
            .expect({
                id: newClientId,
                deleted: true
            })
    })
});

describe('should handle duplicate constraint exception', () => {
    const validData = {
        name: "test",
        backends: {
            webservices: {
                username: 'test-user',
                password: 'test-password',
                productOffersConfigurations: []
            }
        },
        activePartnerNumber: 12345,
        secrets: [
            uuid(),
            uuid()
        ],
        publicClientIds: [
            uuid(),
            uuid()
        ]
    };
    it('add new client', async () => {
        return request(app)
            .post("/wertgarantie/clients")
            .set('Accept', 'application/json')
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
            .send(validData)
            .expect(200)
            .then(response => {
                const {id, name, secrets, publicClientIds, backends, activePartnerNumber} = response.body;
                validData.id = id;
                expect(validData.name).toEqual(name);
                expect(validData.secrets.sort()).toEqual(secrets);
                expect(validData.publicClientIds.sort()).toEqual(publicClientIds);
                expect(validData.backends.webservices.username).toEqual(backends.webservices.username);
                expect(validData.backends.webservices.password).toEqual(backends.webservices.password);
                expect(validData.activePartnerNumber).toEqual(activePartnerNumber);
            });
    });

    it('throw exception when trying to add same client data again', async () => {
        validData.id = uuid();
        return await request(app)
            .post("/wertgarantie/clients")
            .set('Accept', 'application/json')
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
            .send(validData)
            .expect(400)
            .expect({
                "error": "InvalidClientData",
                "message": "duplicate key value violates unique constraint \"clientsecret_pkey\""
            });
    });
});