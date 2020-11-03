module.exports = {
    testRegex: "/fixtures/.*.fixture..*",
    preset: 'ts-jest',
    testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"],
    setupFilesAfterEnv: ['./jest.setup.js'],
};