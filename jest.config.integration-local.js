process.env.NODE_ENV = 'test';
process.env.SIGN_SECRET = "irgendwas";
process.env.DATABASE_URL = "postgresql://admin:bifrost@localhost:5432/bifrost";

module.exports = {
    preset: 'ts-jest',
    verbose: true,
    setupFilesAfterEnv: ['./jest.setup.js'],
    testRegex: "/integration-test/.*\.test\..*",
};