const request = require('supertest');
const app = require('../../src/app');

test('should return proper product data', async () => {
    return request(app).get('/wertgarantie/product').query({
        deviceClass: "ebfb2d44-4ff8-4579-9cc0-0a3ccb8d6f2d",
        productId: 11})
        .expect(200)
        .then(response => {
            console.log(response.body);
        })
});

test('should throw error if device class does not exist', async () => {
    return request(app).get('/wertgarantie/product').query({
        deviceClass: "fda71hf6-4ff8-4579-9cc0-0a3ccb8d6f2e",
        productId: 11})
        .expect(400)
        .then(response => {
            console.log(response.body);
        })
});