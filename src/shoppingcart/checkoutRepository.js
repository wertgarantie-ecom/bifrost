const Pool = require("../framework/postgres").Pool;

exports.persist = async function persist(checkoutData) {
    const pool = Pool.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const query = {
            name: 'insert-checkout-data',
            text: "INSERT INTO checkout (clientid, sessionid, timestamp, traceid, purchases, test) VALUES ($1 , $2 , now(), $3, $4, $5);",
            values: [
                checkoutData.clientId,
                checkoutData.sessionId,
                checkoutData.traceId,
                JSON.stringify(checkoutData.purchases),
                checkoutData.test
            ]
        };
        await client.query(query);
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

function toCheckoutData(rows) {
    if (rows.length > 0) {
        return rows.map(row => {
            return {
                clientId: row.clientid,
                sessionId: row.sessionid,
                traceId: row.traceid,
                test: row.test,
                purchases: row.purchases
            }
        });
    } else {
        return [];
    }
}

exports.findAll = async function findAllCheckouts(limit) {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: 'find-all-checkout-data',
        text: 'select * from checkout c order by c.timestamp desc limit $1;',
        values: [limit]
    });
    return toCheckoutData(result.rows);
};

exports.findBySessionId = async function findBySessionId(sessionID) {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: 'find-by-session-id',
        text: `SELECT * FROM checkout
               WHERE sessionid = $1`,
        values: [sessionID]
    });
    const checkoutData = toCheckoutData(result.rows);
    return checkoutData.length === 0 ? undefined : checkoutData[0];
};