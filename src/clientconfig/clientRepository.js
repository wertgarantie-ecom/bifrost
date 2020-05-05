const Pool = require("../framework/postgres").Pool;

exports.update = async function updateBackendConfig(id, backendConfig) {
    const pool = Pool.getInstance();
    await pool.query({
        name: 'upudate-backends-config',
        text: "UPDATE client SET backends = $2 where client.id = $1;",
        values: [
            id,
            backendConfig
        ]
    });
    return await findClientById(id);
};

exports.insert = async function insert(clientData) {
    const pool = Pool.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const query = {
            name: 'insert-client',
            text: "INSERT INTO client (id, name, backends, activePartnerNumber) VALUES ($1 , $2, $3, $4);",
            values: [
                clientData.id,
                clientData.name,
                JSON.stringify(clientData.backends),
                clientData.activePartnerNumber,
            ]
        };
        await client.query(query);
        await Promise.all(clientData.secrets.map(secret => {
            const insertSecret = {
                name: 'insert-client-secrets',
                text: 'INSERT INTO ClientSecret (secret, clientid) VALUES ($1, $2);',
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
                text: 'INSERT INTO ClientPublicId (publicid, clientid) VALUES ($1, $2);',
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
        text: `SELECT c.id, c.name, c.backends, c.activepartnernumber, ARRAY_AGG(DISTINCT(cs.secret)) secrets, ARRAY_AGG(DISTINCT(cp.publicid)) publicids FROM client c 
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
        text: `SELECT c.id, c.name, c.backends, c.activepartnernumber, ARRAY_AGG(DISTINCT(cs.secret)) secrets, ARRAY_AGG(DISTINCT(cp.publicid)) publicids FROM client c 
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

async function findClientById(id) {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: 'find-by-id',
        text: `SELECT c.id, c.name, c.backends, c.activepartnernumber, ARRAY_AGG(DISTINCT(cs.secret)) secrets, ARRAY_AGG(DISTINCT(cp.publicid)) publicids FROM client c 
                INNER JOIN clientsecret cs on c.id = cs.clientid
                INNER JOIN clientpublicid cp on c.id = cp.clientid
                WHERE c.id = $1
                GROUP BY c.id;`,
        values: [id]
    });
    if (result.rowCount > 0) {
        return toClientData(result.rows[0]);
    } else {
        return undefined;
    }
}

exports.findClientById = findClientById;

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
        text: `SELECT c.id, c.name, c.backends, c.activepartnernumber, ARRAY_AGG(DISTINCT(cs.secret)) secrets, ARRAY_AGG(DISTINCT(cp.publicid)) publicids
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
};

function toClients(rows) {
    return rows.map(toClientData);
}

function toClientData(row) {
    return {
        id: row.id,
        name: row.name,
        backends: row.backends || undefined,
        activePartnerNumber: row.activepartnernumber,
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