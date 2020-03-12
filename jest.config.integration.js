process.env.NODE_ENV = 'test';
process.env.SIGN_SECRET = "irgendwas";
process.env.HEIMDALL_URI = "http://heimdallDummyUrl";
process.env.JEST_JUNIT_OUTPUT_DIR = "reports/junit/bifrost-integration-test-results.xml";

module.exports = {
    verbose: true,
    testRegex: "/integration-test/.*\.test\..*",
    setupFilesAfterEnv: ['./jest.setup.js'],
    globalSetup: "./testcontainerSetup.js",
    globalTeardown: "./testcontainerTeardown.js",
    reporters: ["default", "jest-junit", ["jest-html-reporters", {
        "publicPath": "./reports/html/",
        "filename": "bifrost-integration.html",
        "expand": true
    }]]
};