const Pool = require("../postgres").Pool;
const CryptoJS = require('crypto-js');

exports.persist = async function persist(document) {
    var hash = CryptoJS.SHA1(document.content).toString();

    const pool = Pool.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        if (await this.findById(hash)) {
            return hash;
        }

        const query = {
            name: 'insert-document',
            text: "INSERT INTO documents (id, name, type, content) VALUES ($1 , $2 , $3, $4);",
            values: [
                hash,
                document.FILENAME,
                document.type,
                document.CONTENT
            ]
        };
        await client.query(query);
        await client.query('COMMIT');
        return hash;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

exports.findById = async function findById(id) {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: 'find-document-by-id',
        text: `select id, name, type, content from documents where id = $1`,
        values: [id]
    });
    if (result.rowCount > 0) {
        return toDocument(result.rows[0]);
    } else {
        return undefined;
    }
};

function toDocument(row) {
    return {
        id: row.id,
        content: row.content,
        name: row.name,
        type: row.type
    }
}

