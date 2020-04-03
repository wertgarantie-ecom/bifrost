const request = require('supertest');
const app = require('../src/app');

describe('add phone test shop client', () => {
    test('should add phone test shop client configuration', async (done) => {
        const validData = {
            id: "433295ef-ec5d-45d2-8701-d530e44fcf88",
            name: "Test Shop Handy",
            heimdallClientId: "test-phone-heimdall-clientId",
            webservices: {
                username: "test-phone-user",
                password: "test-phone-password"

            },
            activePartnerNumber: 11111,
            secrets: [
                "secret:test-phone-secret"
            ],
            publicClientIds: [
                "public:5209d6ea-1a6e-11ea-9f8d-778f0ad9137f"
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
            id: "ad0a99e6-a165-4eda-91fc-564fb3f935b4",
            name: "Test Shop Bike",
            heimdallClientId: "test-bike-heimdall-clientId",
            webservices: {
                username: "test-bike-user",
                password: "test-bike-password"
            },
            activePartnerNumber: 22222,
            secrets: [
                "secret:test-bike-secret"
            ],
            publicClientIds: [
                "public:5a576bd2-1953-4d20-80de-4de00d65fdc7"
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
            id: "9302410c-fbbe-44e3-a628-0d42d3944078",
            name: "Handyflash DEV",
            heimdallClientId: "test-handyflash-heimdall-clientId",
            webservices: {
                username: "test-handyflash-user",
                password: "test-handyflash-password"
            },
            activePartnerNumber: 33333,
            secrets: [
                "secret:test-handyflash-secret"
            ],
            publicClientIds: [
                "public:b9f303d0-74e1-11ea-b9e9-034d1bd36e8d"
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

});