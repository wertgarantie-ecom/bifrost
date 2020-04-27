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
                text: 'INSERT INTO purchase (id, sessionid, wertgarantieproductid, wertgarantieproductname, wertgarantiedeviceclass, shopdeviceclass, shopdeviceprice, shopdevicemodel, success, message, contractnumber, transactionnumber, activationcode, backend, resultcode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);',
                values: [
                    purchase.id,
                    checkoutData.sessionId,
                    purchase.wertgarantieProductId,
                    purchase.wertgarantieProductName,
                    purchase.wertgarantieDeviceClass,
                    purchase.shopDeviceClass,
                    purchase.shopDevicePrice,
                    purchase.shopDeviceModel,
                    purchase.success,
                    purchase.message,
                    purchase.contractNumber,
                    purchase.transactionNumber,
                    purchase.activationCode,
                    purchase.backend,
                    purchase.resultCode
                ]
            };
            return client.query(purchaseQuery);
        }));
        await client.query('COMMIT');
        return findBySessionId(checkoutData.sessionId);
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
            wertgarantieDeviceClass: row.wertgarantiedeviceclass,
            shopDeviceClass: row.shopdeviceclass,
            shopDevicePrice: row.shopdeviceprice,
            shopDeviceModel: row.shopdevicemodel,
            success: row.success,
            message: row.message,
            contractNumber: row.contractnumber || undefined,
            transactionNumber: row.transactionnumber || undefined,
            activationCode: row.activationcode || undefined,
            resultCode: row.resultcode || undefined,
            backend: row.backend
        }
    })
}

async function findBySessionId(sessionID) {
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
}

exports.findBySessionId = findBySessionId;