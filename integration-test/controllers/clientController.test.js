const request = require('supertest');
const app = require('../../src/app');
const uuid = require('uuid');

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
            .post("/wertgarantie/client")
            .send(validData)
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                const {id, name, secrets, publicClientIds} = response.body;
                validData.id = id
                expect(validData.name).toEqual(name);
                expect(validData.secrets.sort()).toEqual(secrets);
                expect(validData.publicClientIds.sort()).toEqual(publicClientIds);
            })
    });

    it('should find all clients', async () => {
        return await request(app)
            .get("/wertgarantie/client")
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                const {clients} = response.body;
                expect(clients.length).toBe(1);
                expect(clients[0].name).toEqual(validData.name);
                expect(clients[0].secrets).toEqual(validData.secrets.sort());
                expect(clients[0].publicClientIds).toEqual(validData.publicClientIds.sort());
            })
    });

    it('should delete client', async () => {
        return await request(app)
            .delete("/wertgarantie/client")
            .send({id: validData.id})
            .set('Accept', 'application/json')
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
            .post("/wertgarantie/client")
            .send(validData)
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                const {id, name, secrets, publicClientIds} = response.body;
                validData.id = id
                expect(validData.name).toEqual(name);
                expect(validData.secrets.sort()).toEqual(secrets);
                expect(validData.publicClientIds.sort()).toEqual(publicClientIds);
            })
    });

    it('throw exception when trying to add same client data again', async () => {
        return await request(app)
            .post("/wertgarantie/client")
            .send(validData)
            .set('Accept', 'application/json')
            .expect(400)
            .expect({
                "error": "InvalidClientData",
                "message": "duplicate key value violates unique constraint \"clientsecret_pkey\""
            });
    });
})
