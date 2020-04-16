const Pool = require("../postgres").Pool;
const CryptoJS = require('crypto-js');

function hashProductOffers(productOffers) {
    const relevantOfferParts = productOffers.map(offer => {
        return {
            documents: offer.documents,
            advantages: offer.advantages,
            devices: offer.devices
        };
    });

    const asString = JSON.stringify(relevantOfferParts);
    return CryptoJS.SHA1(asString).toString();
}

exports.persistProductOffersForClient = async function persistProductOffersForClient(productOffers) {
    const pool = Pool.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const query = {
            name: 'insert-product-offers',
            text: "INSERT INTO productoffers (id, clientid, productoffers) VALUES ($1 , $2, $3);",
            values: [
                productOffers[0].clientId,
                JSON.stringify(productOffers)
            ]
        };
        await client.query(query);
        await client.query('COMMIT');
        return await this.findByClientId(productOffers[0].clientId);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

exports.findByClientId = async function findByClientId(clientId) {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: 'find-product-offers-by-client-id',
        text: `SELECT productoffers FROM client  
               WHERE id = $1`,
        values: [clientId]
    });
    if (result.rowCount > 0) {
        return result.rows.map(toProductOffer);
    } else {
        return undefined;
    }
};

function toProductOffer(row) {
    // make product offer
}