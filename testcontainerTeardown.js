const Pool = require('./src/framework/postgres').Pool;
module.exports = async () => {
    console.log("starting integration test teardown");
    console.log("teardown pool");
    await Pool.getInstance().end();
    console.log("Pool instance ended");
    console.log("teardown postgres container");
    await global.__POSTGRES__.stop();
    console.log("finished integration test teardown");
};