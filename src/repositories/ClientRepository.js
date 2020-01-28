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
                name: 'insert-client-secrets',
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
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}
// read
exports.findClientForSecret = async function findClientForSecret(secret) {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: 'find-by-client-secret',
        text: 'SELECT c.*, cs.*, cp.* FROM client c ' +
            'INNER JOIN clientsecret cs on c.id = cs.clientid ' +
            'INNER JOIN clientpublicid cp on c.id = cp.clientid ' +
            'WHERE cs.secret = $1',
        values: [secret]
    });
    if (result.rowCount > 0) {
        const clientData = toClientData(result.rows[0]);
        const secrets = toSecrets(result.rows);
        const publicClientIds = toPublicClientIds(result.rows);
        clientData.secrets.push(...secrets);
        clientData.publicClientIds.push(...publicClientIds);
        return clientData;
    } else {
        return undefined;
    }
};

function toClientData(row) {
    return {
        clientId: row.id,
        name: row.name,
        secrets: [],
        publicClientIds: []
    }
}

function toSecrets(rows) {
    return rows.map(row => {
        return {
            secret: row.secret,
            clientId: row.clientId
        }
    });
}

function toPublicClientIds(rows) {
    return rows.map(row => {
        return {
            publicId: row.publicid,
            clientId: row.clientId
        }
    });
}

exports.findClientForPublicClientId = function findClientForPublicClientId(publicClientId) {
    const client = _.find(clients, (client) => client.publicClientIds.includes(publicClientId));
    if (!client) {
        throw new InvalidClientIdError(`Could not find Client for specified client ID: ${publicClientId}`);
    }
    return client;
};

class InvalidClientIdError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

// delete