const {GenericContainer} = require("testcontainers");
const {Pool} = require('pg');
const DBMigrate = require('db-migrate');

module.exports = async () => {
    const container = await new GenericContainer("postgres")
        .withEnv('POSTGRES_USER', 'admin')
        .withEnv('POSTGRES_PASSWORD', 'bifrost')
        .withExposedPorts(5432)
        .start();


    const pool = new Pool({
        user: 'admin',
        host: 'localhost',
        database: "postgres",
        password: 'bifrost',
        port: container.getMappedPort(5432),
    });

    console.log("Pool.connect(): ");
    try {
        const client = await pool.connect();
        await client.query('CREATE DATABASE bifrost');
        console.log("created database bifrost");
    } catch (e) {
        console.error("Error: " + e);
    }

    process.env.DATABASE_URL = `postgresql://admin:bifrost@localhost:${container.getMappedPort(5432)}/bifrost`;
    const bifrostMigrate = DBMigrate.getInstance(true);

    await bifrostMigrate.reset();
    await bifrostMigrate.up();

    global.__POSTGRES__ = container;
    global.__POSTGRES_PORT__ = container.getMappedPort(5432);
};