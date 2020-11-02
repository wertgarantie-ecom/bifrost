const Pool = require("../framework/postgres").Pool;
import CryptoJS from 'crypto-js';

interface Entity {
    id: string
}

type Document = PersistableDocument & Entity;


interface PersistableDocument {
    content: string,
    name: string,
    type: string
}

export async function persist(document: PersistableDocument): Promise<string> {
    var hash = CryptoJS.SHA1(document.content + document.name + document.type).toString();

    const pool = Pool.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const query = {
            name: 'insert-document',
            text: "INSERT INTO documents (id, name, type, content) VALUES ($1 , $2 , $3, $4) ON CONFLICT DO NOTHING;",
            values: [
                hash,
                document.name,
                document.type,
                document.content
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
}

export async function findById(id: string): Promise<Document | undefined> {
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
}

function toDocument(row: Document): Document {
    return {
        id: row.id,
        content: row.content,
        name: row.name,
        type: row.type
    }
}

