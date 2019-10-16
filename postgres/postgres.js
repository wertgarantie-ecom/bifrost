const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSTGRES_UR || "postgresql://admin:nimda@localhost:5432/bifrost"
});

function query(text, params, callback) {
    return pool.query(text, params, callback);
}

module.exports = {
    query: query
}
