const request = require('supertest');
const app = require('../../src/app');
const uuid = require('uuid');

describe('should add new client with valid data', () => {
        it('should add new client', async () => {
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
            return await request(app)
                .post("/wertgarantie/client")
                .send(validData)
                .set('Accept', 'application/json')
                .expect(200)
                .then(response => {
                    const {name, secrets, publicClientIds} = response.body;
                    expect(validData.name).toEqual(name);
                    expect(validData.secrets.sort()).toEqual(secrets);
                    expect(validData.publicClientIds.sort()).toEqual(publicClientIds);
                })
        });
    }
);
