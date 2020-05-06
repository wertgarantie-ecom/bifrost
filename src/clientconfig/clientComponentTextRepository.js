const Pool = require("../framework/postgres").Pool;

exports.persist = async function persist(componentTextJson, clientId, locale, componentName) {
    const pool = Pool.getInstance();
    await pool.query({
        name: `insert-client-component-text-${componentName}`,
        text: `INSERT INTO client_component_texts (clientId, locale, ${componentName}) VALUES (
                $1, $2, $3)
                ON CONFLICT ON CONSTRAINT client_component_texts_pkey 
                DO UPDATE
                SET ${componentName} = $3;`,
        values: [
            clientId,
            locale,
            componentTextJson
        ]
    });
    return findByClientIdAndLocaleAndComponent(clientId, locale, componentName);
};

async function findByClientIdAndLocaleAndComponent(clientId, locale, componentName) {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: `find-component-text-by-clientid-for-${componentName}`,
        text: `SELECT ${componentName} FROM client_component_texts WHERE clientId = $1 AND locale = $2;`,
        values: [
            clientId,
            locale
        ]
    });
    if (!result.rows || result.rows.length < 1) {
        return undefined;
    }
    return result.rows[0][componentName];
}

function toComponentTextRessource(rows) {
    const componentTextRessource = {};
    rows.forEach(row => {
        componentTextRessource[row.locale] = {
            ratingTexts: row.rating,
            selectionPopUpTexts: row.selectionpopup,
            confirmationTexts: row.confirmation,
            aftersalesTexts: row.aftersales,
            landingPageTexts: row.landingpage
        }
    });
    return componentTextRessource;
}

async function findAllByClientId(clientId) {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: `find-component-texts-by-clientid`,
        text: `SELECT * FROM client_component_texts WHERE clientId = $1`,
        values: [
            clientId
        ]
    });
    if (!result.rows || result.rows.length < 1) {
        return undefined;
    }
    return toComponentTextRessource(result.rows);
}

exports.findByClientIdAndLocaleAndComponent = findByClientIdAndLocaleAndComponent;
exports.findAllByClientId = findAllByClientId;