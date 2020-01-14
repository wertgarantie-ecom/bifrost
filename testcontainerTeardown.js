const Pool = require('./src/postgres').Pool;
module.exports = async () => {
    console.log("starting integration test teardown");
    console.log("teardown pool");
    try {
        await Pool.getInstance().end();
    } catch (e) {
        // i dont' care
    }
    console.log("teardown postgres container");
    await global.__POSTGRES__.stop();
    console.log("finished integration test teardown");
};