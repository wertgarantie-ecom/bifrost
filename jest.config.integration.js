process.env.NODE_ENV = 'test';
process.env.SIGN_SECRET = "irgendwas";
process.env.BASE_URI = "http://localhost:3000"
process.env.WEBSERVICES_URI = "http://webservicesDummyUrl";
process.env.JEST_JUNIT_OUTPUT_DIR = "reports/junit/bifrost-integration-test-results.xml";

module.exports = {
    verbose: true,
    preset: 'ts-jest',
    testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"],
    testRegex: "integration-test/.*\.test\..*",
    setupFilesAfterEnv: ['./jest.setup.js'],
    globalSetup: "./testcontainerSetup.js",
    globalTeardown: "./testcontainerTeardown.js",
    reporters: ["default", "jest-junit", ["jest-html-reporters", {
        "publicPath": "./reports/html/",
        "filename": "bifrost-integration.html",
        "expand": true
    }]]
};