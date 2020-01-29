process.env.NODE_ENV = 'test';
process.env.SIGN_SECRET = "irgendwas";
process.env.HEIMDALL_URI = "http://heimdallDummyUrl";
process.env.DATABASE_URL = "postgresql://admin:bifrost@localhost:5432/bifrost";

module.exports = {
    verbose: true,
    setupFilesAfterEnv: ['./jest.setup.js'],
    testRegex: "/integration-test/.*\.test\..*",
};