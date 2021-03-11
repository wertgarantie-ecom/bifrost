import { Pool as PoolInstance } from "pg";

const options = process.env.NODE_ENV === 'test' ? 
    { connectionString: process.env.DATABASE_URL } : 
    { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: true }
}

export const Pool = (function () {
    let instance: PoolInstance;

    function createInstance() {
        const pool = new PoolInstance(options);
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

