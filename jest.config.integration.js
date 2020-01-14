process.env.NODE_ENV = 'test';
process.env.SIGN_SECRET = "irgendwas";
process.env.HEIMDALL_URI = "https://heimdall-mock.herokuapp.com";

module.exports = {
    verbose: true,
    testRegex: "/integration-test/.*",
    preset: '@trendyol/jest-testcontainers'
};