const request = require('supertest');
const app = require('../../app');
const Joi = require('@hapi/joi');

const responseSchema = Joi.object({
    text: Joi.string(),
    rating: Joi.number(),
    uri: Joi.string(),
    blabla: Joi.object({
        sub1: Joi.string().required(),
        sub2: Joi.string().required()
    })
});

var schemaTest = {
    text: "test",
    rating: 1.22,
    uri: "bla",
    blabla: {
        sub1: "string"
    }
}
try {
    Joi.assert(schemaTest, responseSchema);
} catch (e) {
    console.log(e);
}

describe('Get Google Rating test', () => {
    test('should return google rating', async () => {
        const response = await request(app).get('/wertgarantie/rating').send();
        var validation = responseSchema.validate(response.body);
        console.log(validation);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('text');
        expect(response.body.text).toMatch(/Google/);
        expect(response.body).toHaveProperty('rating');
        expect(response.body).toHaveProperty('uri');
    })
})

