const Pool = require("../framework/postgres").Pool;

exports.updateBackendConfig = async function updateBackendConfig(id, backendConfig) {
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
            text: "INSERT INTO client (id, name, email, backends, activePartnerNumber, basicauthuser, basicauthpassword, handbook, loaderConfig, conditionsMapping) VALUES ($1 , $2, $3, $4, $5, $6, $7, $8, $9, $10);",
            values: [
                clientData.id,
                clientData.name,
                clientData.email,
                JSON.stringify(clientData.backends),
                clientData.activePartnerNumber,
                clientData.basicAuthUser,
                clientData.basicAuthPassword,
                clientData.handbook,
                JSON.stringify(clientData.loaderConfig),
                JSON.stringify(clientData.conditionsMapping)
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

exports.update = async function update(clientData) {
    const pool = Pool.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const updateStatement = {
            name: 'update-client-data',
            text: 'UPDATE client SET name = $1, activepartnernumber = $2, backends = $3, email = $4, basicauthuser = $5, basicauthpassword = $6, handbook = $7, loaderConfig = $8, conditionsmapping = $9' +
                'WHERE id = $10',
            values: [
                clientData.name,
                clientData.activePartnerNumber,
                JSON.stringify(clientData.backends),
                clientData.email,
                clientData.basicAuthUser,
                clientData.basicAuthPassword,
                clientData.handbook,
                JSON.stringify(clientData.loaderConfig),
                JSON.stringify(clientData.conditionsMapping),
                clientData.id
            ]
        };
        await client.query(updateStatement);
        await Promise.all(clientData.secrets.map(secret => {
            const updateSecrets = {
                name: 'insert-new-client-secrets',
                text: 'INSERT INTO ClientSecret (secret, clientid) VALUES ($1, $2) ON CONFLICT DO NOTHING;',
                values: [
                    secret,
                    clientData.id
                ]
            };
            return client.query(updateSecrets);
        }));
        await Promise.all(clientData.publicClientIds.map(publicClientId => {
            const updatePublicClientIds = {
                name: 'insert-new-client-public-ids',
                text: 'INSERT INTO ClientPublicId (publicid, clientid) VALUES ($1, $2) ON CONFLICT DO NOTHING;',
                values: [
                    publicClientId,
                    clientData.id
                ]
            };
            return client.query(updatePublicClientIds);
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

exports.findClientForSecret = async function findClientForSecret(secret) {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: 'find-by-client-secret',
        text: `SELECT c.id,
                      c.name,
                      c.email,
                      c.backends,
                      c.activepartnernumber,
                      c.basicauthuser,
                      c.basicauthpassword,
                      c.handbook,
                      c.loaderconfig,
                      c.conditionsmapping,
                      ARRAY_AGG(DISTINCT (cs.secret))   secrets,
                      ARRAY_AGG(DISTINCT (cp.publicid)) publicids
               FROM client c
                        INNER JOIN clientsecret cs on c.id = cs.clientid
                        INNER JOIN clientpublicid cp on c.id = cp.clientid
               WHERE c.id = (SELECT clientid
                             from clientsecret
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
        text: `SELECT c.id,
                      c.name,
                      c.email,
                      c.backends,
                      c.activepartnernumber,
                      c.basicauthuser,
                      c.basicauthpassword,
                      c.handbook,
                      c.loaderconfig,
                      c.conditionsmapping,
                      ARRAY_AGG(DISTINCT (cs.secret))   secrets,
                      ARRAY_AGG(DISTINCT (cp.publicid)) publicids
               FROM client c
                        INNER JOIN clientsecret cs on c.id = cs.clientid
                        INNER JOIN clientpublicid cp on c.id = cp.clientid
               WHERE c.id = (SELECT clientid
                             from clientpublicid
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
        text: `SELECT c.id,
                      c.name,
                      c.email,
                      c.backends,
                      c.activepartnernumber,
                      c.basicauthuser,
                      c.basicauthpassword,
                      c.handbook,
                      c.loaderconfig,
                      c.conditionsmapping,
                      ARRAY_AGG(DISTINCT (cs.secret))   secrets,
                      ARRAY_AGG(DISTINCT (cp.publicid)) publicids
               FROM client c
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
        text: `SELECT c.id,
                      c.name,
                      c.email,
                      c.backends,
                      c.activepartnernumber,
                      c.basicauthuser,
                      c.basicauthpassword,
                      c.handbook,
                      c.loaderconfig,
                      c.conditionsmapping,
                      ARRAY_AGG(DISTINCT (cs.secret))   secrets,
                      ARRAY_AGG(DISTINCT (cp.publicid)) publicids
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

exports.findByUsername = async function findByUsername(username) {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: 'find-all-clients',
        text: `SELECT c.id,
                      c.name,
                      c.email,
                      c.backends,
                      c.activepartnernumber,
                      c.basicauthuser,
                      c.basicauthpassword,
                      c.handbook,
                      c.loaderconfig,
                      c.conditionsmapping,
                      ARRAY_AGG(DISTINCT (cs.secret))   secrets,
                      ARRAY_AGG(DISTINCT (cp.publicid)) publicids
               FROM client c
                        INNER JOIN clientsecret cs on c.id = cs.clientid
                        INNER JOIN clientpublicid cp on c.id = cp.clientid
               where c.basicauthuser = $1
               GROUP By c.id`,
        values: [username]
    });
    if (result.rowCount > 0) {
        return toClientData(result.rows[0]);
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
        email: row.email || undefined,
        backends: row.backends || undefined,
        activePartnerNumber: row.activepartnernumber,
        secrets: row.secrets,
        publicClientIds: row.publicids,
        basicAuthUser: row.basicauthuser || undefined,
        basicAuthPassword: row.basicauthpassword || undefined,
        handbook: row.handbook || undefined,
        loaderConfig: row.loaderconfig || undefined,
        conditionsMapping: row.conditionsmapping || undefined
    }
}

class InvalidClientData extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}