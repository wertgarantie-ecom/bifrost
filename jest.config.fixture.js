module.exports = {
    testRegex: "/fixtures/.*.fixture..*",
    preset: 'ts-jest',
    setupFilesAfterEnv: ['./jest-default-timeout.js'],
};