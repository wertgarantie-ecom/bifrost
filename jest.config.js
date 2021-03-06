require('iconv-lite/encodings');
process.env.NODE_ENV = 'test';
process.env.SIGN_SECRET = "irgendwas";
process.env.JEST_JUNIT_OUTPUT_DIR = "reports/junit/bifrost-unit-test-results.xml";
process.env.BASE_URI = "http://localhost:3000";

module.exports = {
    testEnvironment: 'node',
    testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/", "<rootDir>/integration-test/"],
    reporters: ["default", "jest-junit", ["jest-html-reporters", {
        "publicPath": "./reports/html/",
        "filename": "bifrost-unit.html",
        "expand": true
    }]],
    preset: 'ts-jest',
    setupFilesAfterEnv: ['./jest.setup.js'],
};