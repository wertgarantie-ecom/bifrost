const {Pool} = require('pg');

const pool = new Pool({
    connectionString: (process.env.NODE_ENV !== "test") ? process.env.DATABASE_URL : `postgresql://admin:bifrost@localhost:${global.__TESTCONTAINERS_POSTGRES_PORT__}`
});

module.exports.pool = pool;