const pool = require("../postgres").pool;


function persist(checkoutData) {
    return pool.query({
        name: 'insert-checkout-data',
        text: "INSERT INTO checkout (clientid, sessionid, timestamp, traceid) VALUES ($1 , $2 , now(), $3);",
        value: [checkoutData.clientId, checkoutData.sessionId, checkoutData.traceId]
    })
}

function findBySessionId(sessionID) {

}