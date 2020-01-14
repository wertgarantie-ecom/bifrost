const {Pool} = require('pg');

var PoolInstanceHolder = (function () {
    var instance;

    function createInstance() {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL
        });
        pool.on('error', (error) => error);
        return pool;
    }

    return {
        getInstance: () => {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

module.exports.Pool = PoolInstanceHolder;