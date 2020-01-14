const Pool = require('../../src/postgres').Pool;
describe('Postgres Tests', () => {

    test('get simple now() from postgres', async () => {
        pool = Pool.getInstance();
        const response = await pool.query('SELECT NOW()');
        console.log(response.rows);
    });
});