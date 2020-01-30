const request = require('supertest');
const app = require('../src/app');

test('should add new client with valid data', async (done) => {
    const validData = {
        name: "local-testShop",
        secrets: [
            "test-secret"
        ],
        publicClientIds: [
            "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f"
        ]
    };

    const response = await request(app)
        .get(`/wertgarantie/clients?publicClientId=${validData.publicClientIds[0]}`)
        .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
        .set('Accept', 'application/json')
        .send(validData);

    console.log(JSON.stringify(response.body, null, 2));
    if (response.status !== 200) {
        await request(app)
            .post("/wertgarantie/clients")
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD)
            .set('Accept', 'application/json')
            .send(validData)
            .expect(200);
    }
    done();
});

