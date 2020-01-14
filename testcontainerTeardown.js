module.exports = async () => {
    await global.__POSTGRES__.stop();
}