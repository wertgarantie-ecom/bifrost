const request = require('supertest');
const app = require('../src/app');

test('should add phone test shop client configuration', async (done) => {
    const validData = {
        name: "Test Shop Handy",
        secrets: [
            "test-phone-secret"
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

test('should add bike test shop client configuration', async (done) => {
    const validData = {
        name: "Test Shop Bike",
        secrets: [
            "test-bike-secret"
        ],
        publicClientIds: [
            "5a576bd2-1953-4d20-80de-4de00d65fdc7"
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

test('should add Handyflash DEV test client configuration', async (done) => {
    const validData = {
        name: "Handyflash DEV",
        secrets: [
            "test-handyflash-secret"
        ],
        publicClientIds: [
            "b9f303d0-74e1-11ea-b9e9-034d1bd36e8d"
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

