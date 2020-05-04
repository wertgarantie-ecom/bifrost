const Pool = require("../postgres").Pool;
const _ = require('lodash');

exports.findAll = async function findAllCheckouts(limit) {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: 'find-all-checkout-data',
        text: 'select * from checkout c, purchase p where c.sessionid = p.sessionid order by c.timestamp desc limit $1;',
        values: [limit]
    });
    return toCheckoutData(result.rows);
}


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

function toCheckoutData(rows) {
    function groupedRowsToCheckoutData(rows) {

        function rowToCheckoutData(row) {
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

        if (rows.length > 0) {
            const checkoutData = rowToCheckoutData(rows[0]);
            const purchases = toPurchases(rows);
            checkoutData.purchases.push(...purchases);
            return checkoutData;
        } else {
            return undefined;
        }
    }

    if (rows.length === 0) {
        return [];
    }

    const rowsBySessionId = _.groupBy(rows, 'sessionid');
    const checkoutData = Object.entries(rowsBySessionId).map(([sessionId, rows]) => groupedRowsToCheckoutData(rows));
    return _.compact(checkoutData);
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
    const checkoutData = toCheckoutData(result.rows);
    return checkoutData.length === 0 ? undefined : checkoutData[0];
};