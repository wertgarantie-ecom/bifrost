const Pool = require("../postgres").Pool;

const clients = [
    {
        name: "bikeShop",
        secrets: ["bikesecret1"],
        publicClientIds: ["5209d6ea-1a6e-11ea-9f8d-778f0ad9137f"]
    },
    {
        name: "handyShop",
        secrets: ["handysecret1"],
        publicClientIds: ["bikeclientId1"]
    }
];

// persist
exports.persistClientSettings = async function persistClientSettings(clientData) {
    const pool = Pool.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const query = {
            name: 'insert-client',
            text: "INSERT INTO client (id, name) VALUES ($1 , $2);",
            values: [
                clientData.id,
                clientData.name
            ]
        };
        await client.query(query);
        await Promise.all(clientData.secrets.map(secret => {
            const insertSecret = {
                name: 'insert-client-secrets',
                text: 'INSERT INTO ClientSecret (secret, clientid)' +
                    'VALUES ($1, $2);',
                values: [
                    secret,
                    clientData.id
                ]
            };
            return client.query(insertSecret);
        }));
        await Promise.all(clientData.publicClientIds.map(clientId => {
            const insertPublicId = {
                name: 'insert-client-public-ids',
                text: 'INSERT INTO ClientPublicId (publicid, clientid)' +
                    'VALUES ($1, $2);',
                values: [
                    clientId,
                    clientData.id
                ]
            };
            return client.query(insertPublicId);
        }));
        await client.query('COMMIT');
        return await this.findClientById(clientData.id);
    } catch (error) {
        await client.query('ROLLBACK');
        if (error.code === '23505' && (error.constraint === 'clientsecret_pkey' || error.constraint === 'clientpublicid_pkey')) {
            throw new InvalidClientData(error.message);
        } else {
            throw error;
        }
    } finally {
        client.release();
    }
};

// read
exports.findClientForSecret = async function findClientForSecret(secret) {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: 'find-by-client-secret',
        text: `SELECT c.id, c.name, ARRAY_AGG(DISTINCT(cs.secret)) secrets, ARRAY_AGG(DISTINCT(cp.publicid)) publicids FROM client c 
                INNER JOIN clientsecret cs on c.id = cs.clientid 
                INNER JOIN clientpublicid cp on c.id = cp.clientid 
                WHERE c.id = (SELECT clientid from clientsecret
                                WHERE secret = $1)
                GROUP BY c.id;`,
        values: [secret]
    });
    if (result.rowCount > 0) {
        return toClientData(result.rows[0]);
    } else {
        return undefined;
    }
};

exports.findClientForPublicClientId = async function findClientForPublicClientId(clientPublicId) {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: 'find-by-client-public-id',
        text: `SELECT c.id, c.name, ARRAY_AGG(DISTINCT(cs.secret)) secrets, ARRAY_AGG(DISTINCT(cp.publicid)) publicids FROM client c 
                INNER JOIN clientsecret cs on c.id = cs.clientid 
                INNER JOIN clientpublicid cp on c.id = cp.clientid 
                WHERE c.id = (SELECT clientid from clientpublicid 
                                WHERE publicid = $1)
                GROUP BY c.id;`,
        values: [clientPublicId]
    });
    if (result.rowCount > 0) {
        return toClientData(result.rows[0]);
    } else {
        return undefined;
    }
};

exports.findClientById = async function findClientById(id) {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: 'find-by-id',
        text: `SELECT c.id, c.name, ARRAY_AGG(DISTINCT(cs.secret)) secrets, ARRAY_AGG(DISTINCT(cp.publicid)) publicids FROM client c 
                INNER JOIN clientsecret cs on c.id = cs.clientid
                INNER JOIN clientpublicid cp on c.id = cp.clientid
                WHERE id = $1
                GROUP BY c.id;`,
        values: [id]
    });
    if (result.rowCount > 0) {
        return toClientData(result.rows[0]);
    } else {
        return undefined;
    }
};

exports.deleteClientById = async function deleteClientById(id) {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: 'delete-by-id',
        text: 'DELETE FROM client where client.id = $1',
        values: [id]
    });
    return result.rowCount > 0;
};

exports.findAllClients = async function findAllClients() {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: 'find-all-clients',
        text: `SELECT c.id, c.name, ARRAY_AGG(DISTINCT(cs.secret)) secrets, ARRAY_AGG(DISTINCT(cp.publicid)) publicids
                FROM client c
                INNER JOIN clientsecret cs on c.id = cs.clientid
                INNER JOIN clientpublicid cp on c.id = cp.clientid
                GROUP By c.id`
    });
    if (result.rowCount > 0) {
        return toClients(result.rows);
    } else {
        return undefined;
    }
}

function toClients(rows) {
    return rows.map(toClientData);
}

function toClientData(row) {
    return {
        id: row.id,
        name: row.name,
        secrets: row.secrets,
        publicClientIds: row.publicids
    }
}

class InvalidClientData extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}