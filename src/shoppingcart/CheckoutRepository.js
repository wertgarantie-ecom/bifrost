const Pool = require("../postgres").Pool;


exports.persist = async function persist(checkoutData) {
    const pool = Pool.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const query = {
            name: 'insert-checkout-data',
            text: "INSERT INTO checkout (clientid, sessionid, timestamp, traceid) VALUES ($1 , $2 , now(), $3);",
            values: [
                checkoutData.clientId,
                checkoutData.sessionId,
                checkoutData.traceId
            ]
        };
        await client.query(query);

        await Promise.all(checkoutData.purchases.map(purchase => {
            const purchaseQuery = {
                name: 'insert-purchases',
                text: 'INSERT INTO purchase (id, sessionid, wertgarantieproductid, wertgarantieproductname, deviceclass, deviceprice, success, message, shopproduct, contractnumber, transactionnumber, backend, backendResponseInfoJson) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);',
                values: [
                    purchase.id,
                    checkoutData.sessionId,
                    purchase.wertgarantieProductId,
                    purchase.wertgarantieProductName,
                    purchase.deviceClass,
                    purchase.devicePrice,
                    purchase.success,
                    purchase.message,
                    purchase.shopProduct,
                    purchase.contractNumber,
                    purchase.transactionNumber,
                    purchase.backend,
                    JSON.stringify(purchase.backendResponseInfo)
                ]
            };
            return client.query(purchaseQuery);
        }));
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

function toCheckoutData(row) {
    return {
        clientId: row.clientid,
        sessionId: row.sessionid,
        traceId: row.traceid,
        purchases: []
    }
}

function toPurchases(rows) {
    return rows.map(row => {
        return {
            id: row.id,
            wertgarantieProductId: row.wertgarantieproductid,
            wertgarantieProductName: row.wertgarantieproductname,
            deviceClass: row.deviceclass,
            devicePrice: row.deviceprice,
            success: row.success,
            message: row.message,
            shopProduct: row.shopproduct,
            contractNumber: row.contractnumber,
            transactionNumber: row.transactionnumber,
            backend: row.backend,
            backendResponseInfo: row.backendresponseinfojson
        }
    })
}

exports.findBySessionId = async function findBySessionId(sessionID) {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: 'find-by-session-id',
        text: 'SELECT c.*, p.* FROM checkout c ' +
            'INNER JOIN purchase p on p.sessionid = c.sessionid ' +
            'WHERE c.sessionid = $1',
        values: [sessionID]
    });
    if (result.rowCount > 0) {
        const checkoutData = toCheckoutData(result.rows[0]);
        const purchases = toPurchases(result.rows);
        checkoutData.purchases.push(...purchases);
        return checkoutData;
    } else {
        return undefined;
    }
};