const pool = require('../../src/postgres').pool;
describe('Postgres Tests', () => {

    test('get simple now() from postgres', async () => {
        const response = await pool.query('SELECT NOW()');
        console.log(response.rows);
    });
});