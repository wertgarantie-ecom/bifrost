require('iconv-lite/encodings');
process.env.NODE_ENV = 'test';
process.env.SIGN_SECRET = "irgendwas";
process.env.HEIMDALL_URI = "http://heimdallDummyUrl";

module.exports = {
    testRegex: "/test/.*\.test\..*"
};