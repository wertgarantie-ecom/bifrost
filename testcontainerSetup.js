const { GenericContainer } = require("testcontainers");
const { Pool } = require('pg').native;
// const DBMigrate = require("db-migrate");
process.env.DATABASE_URL

module.exports = async () => {
    const container = await new GenericContainer("postgres")
        .withEnv('POSTGRES_USER', 'admin')
        .withEnv('POSTGRES_PASSWORD', 'bifrost')
        .withExposedPorts(5432)
        .start();
    process.env.DATABASE_URL = `postgresql://admin:bifrost@localhost:${container.getMappedPort(5432)}`;


    const pool = new Pool({
        user: 'admin',
        host: 'localhost',
        password: 'bifrost',
        port: container.getMappedPort(5432),
        connectionTimeoutMillis: 10000
    });

    // pool.on('error', error => {
    //     console.error('error event on pool (%s)', error);
    // });

    console.log("Pool.connect(): ")
    try {
        const client = await pool.connect()
        await client.query('SELECT NOW()')
    } catch (e) {
        console.error(e);
    }



    // await dbmigrateBlank.createDatabase('bifrost');

    // // \c bifrost
    // console.log("Getting new DB instance and switch to 'bifrost' database");
    // process.env.DATABASE_URL = `postgresql://admin:bifrost@localhost:${container.getMappedPort(5432)}/bifrost`;
    // const bifrostMigrate = DBMigrate.getInstance(true);

    // await bifrostMigrate.reset();
    // await bifrostMigrate.up();

    global.__POSTGRES__ = container;
};