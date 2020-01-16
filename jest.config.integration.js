process.env.NODE_ENV = 'test';
process.env.SIGN_SECRET = "irgendwas";
process.env.HEIMDALL_URI = "http://heimdallDummyUrl";

module.exports = {
    verbose: true,
    testRegex: "/integration-test/.*\.test\..*",
    setupFilesAfterEnv: ['./jest.setup.js'],
    globalSetup: "./testcontainerSetup.js",
    globalTeardown: "./testcontainerTeardown.js"
};