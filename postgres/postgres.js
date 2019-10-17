const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

function query(text, params, callback) {
    return pool.query(text, params, callback);
}

module.exports = {
    query: query
}
