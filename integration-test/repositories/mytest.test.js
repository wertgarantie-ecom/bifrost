const pool = require('../../src/postgres').pool;
describe('User tests', () => {

    beforeAll(async () => {
    });

    afterAll(async () => {
        /* stop Postgres contrainer */
        await pool.end();
    });


    test('User must be created', async () => {
        const response = await pool.query('SELECT NOW()');
        console.log(response);
    });
});