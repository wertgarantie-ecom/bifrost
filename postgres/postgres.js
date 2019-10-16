const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URI
});

function query(text, params, callback) {
    return pool.query(text, params, callback);
}

module.exports = {
    query: query
}
