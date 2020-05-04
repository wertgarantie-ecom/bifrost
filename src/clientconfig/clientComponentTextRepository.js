const Pool = require("../postgres").Pool;

exports.persist = async function persist(componentTextJson, clientId, componentName) {
    const pool = Pool.getInstance();
    await pool.query({
        name: `insert-client-component-text`,
        text: `INSERT INTO client_component_texts (clientId, ${componentName}) VALUES (
                $1, $2
            );`,
        values: [
            clientId,
            componentTextJson
        ]
    });
    return findByClientIdAndComponent(clientId, componentName);
};

async function findByClientIdAndComponent(clientId, componentName) {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: `find-component-text-by-clientid-and-component-name`,
        text: `SELECT ${componentName} FROM client_component_texts WHERE clientId = $1;`,
        values: [
            clientId
        ]
    });
    if (!result.rows || result.rows.length < 1) {
        return undefined;
    }
    return result.rows[0][componentName];
}

exports.findByClientIdAndComponent = findByClientIdAndComponent;