const Pool = require("../../framework/postgres").Pool;
const CryptoJS = require('crypto-js');

function hashProductOffers(productOffers) {
    const relevantOfferParts = productOffers.map(offer => {
        return {
            documents: offer.documents,
            advantages: offer.advantages,
            devices: offer.devices,
            lock: offer.lock
        };
    });

    const asString = JSON.stringify(relevantOfferParts);
    return CryptoJS.SHA1(asString).toString();
}

exports.persist = async function persist(productOffers) {
    if (!productOffers || productOffers.length === 0) {
        return [];
    }
    const pool = Pool.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const hash = hashProductOffers(productOffers);
        if (await productOffersExists(productOffers[0].clientId, hash, client)) {
            return productOffers;
        }
        const query = {
            name: 'insert-product-offers',
            text: `INSERT INTO productoffers (clientid, hash, productoffers) VALUES ($1 , $2, $3)
                    ON CONFLICT (clientId)
                    DO UPDATE SET hash = $2, productoffers = $3`,
            values: [
                productOffers[0].clientId,
                hash,
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

async function productOffersExists(clientId, hash, pool = Pool.getInstance()) {
    const result = await pool.query({
        name: 'find-product-offers-by-client-id-and-hash',
        text: `SELECT productoffers FROM productoffers  
               WHERE clientid = $1
               AND hash = $2`,
        values: [clientId, hash]
    });
    return result.rowCount > 0;
}

exports.findByClientId = async function findByClientId(clientId) {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: 'find-product-offers-by-client-id',
        text: `SELECT productoffers FROM productoffers  
               WHERE clientid = $1`,
        values: [clientId]
    });
    if (result.rowCount > 0) {
        return result.rows[0].productoffers;
    } else {
        return undefined;
    }
};

exports.findById = async function findById(productOfferId) {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: 'find-product-offer-by-id',
        text: `SELECT * FROM (SELECT jsonb_array_elements(p.productoffers) as offer FROM productoffers p) po WHERE  po.offer ->> 'id' = $1`,
        values: [productOfferId]
    });
    if (result.rowCount > 0) {
        return result.rows[0].offer;
    } else {
        return undefined;
    }
}