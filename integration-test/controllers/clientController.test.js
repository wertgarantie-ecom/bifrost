const request = require('supertest');
const app = require('../../src/app');
const uuid = require('uuid');
const _ = require('lodash');

describe('should add new client with valid data', () => {
    const validData = {
        name: "test",
        secrets: [
            uuid(),
            uuid()
        ],
        publicClientIds: [
            uuid(),
            uuid()
        ]
    };
    it('should add new client', async () => {
        return await request(app)
            .post("/wertgarantie/clients")
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
            .set('Accept', 'application/json')
            .send(validData)
            .expect(200)
            .then(response => {
                const {id, name, secrets, publicClientIds} = response.body;
                validData.id = id;
                expect(validData.name).toEqual(name);
                expect(validData.secrets.sort()).toEqual(secrets);
                expect(validData.publicClientIds.sort()).toEqual(publicClientIds);
            })
    });

    it('should find all clients', async () => {
        return await request(app)
            .get("/wertgarantie/clients")
            .set('Accept', 'application/json')
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
            .expect(200)
            .then(response => {
                const {clients} = response.body;
                const createdClient = _.find(clients, {id: validData.id});
                expect(createdClient).toBeDefined()
            })
    });

    it('should delete client', async () => {
        return await request(app)
            .delete(`/wertgarantie/clients/${validData.id}`)
            .set('Accept', 'application/json')
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
            .expect(200)
            .expect({
                id: validData.id,
                deleted: true
            })
    })
});

describe('should handle duplicate constraint exception', () => {
    const validData = {
        name: "test",
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
        return await request(app)
            .post("/wertgarantie/clients")
            .set('Accept', 'application/json')
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
            .send(validData)
            .expect(200)
            .then(response => {
                const {id, name, secrets, publicClientIds} = response.body;
                validData.id = id;
                expect(validData.name).toEqual(name);
                expect(validData.secrets.sort()).toEqual(secrets);
                expect(validData.publicClientIds.sort()).toEqual(publicClientIds);
            })
    });

    it('throw exception when trying to add same client data again', async () => {
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