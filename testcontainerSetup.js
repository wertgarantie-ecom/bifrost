const {GenericContainer} = require("testcontainers");
const {Pool} = require('pg');
const DBMigrate = require('db-migrate');

module.exports = async () => {
    console.log("setup integration tests");
    // currently ryuk is really slow to start, let's skip it for now
    process.env.TESTCONTAINERS_RYUK_DISABLED = "true";
    const container = await new GenericContainer("postgres:11.6")
        .withEnv('POSTGRES_USER', 'admin')
        .withEnv('POSTGRES_PASSWORD', 'bifrost')
        .withExposedPorts(5432)
        .start();

    console.log("postgres container started");

    const pool = new Pool({
        user: 'admin',
        host: 'localhost',
        database: "postgres",
        password: 'bifrost',
        port: container.getMappedPort(5432),
    });

    try {
        const client = await pool.connect();
        await client.query('CREATE DATABASE bifrost');
        client.release();
        console.log("bifrost database created");
    } catch (e) {
        console.error("Error: " + e);
    } finally {
        pool.end();
    }

    process.env.DATABASE_URL = `postgresql://admin:bifrost@localhost:${container.getMappedPort(5432)}/bifrost`;
    const bifrostMigrate = DBMigrate.getInstance(true);

    bifrostMigrate.silence(true);
    await bifrostMigrate.reset();
    await bifrostMigrate.up();
    console.log("migrations finished");
    console.log("setup integration tests finished");

    global.__POSTGRES__ = container;
};