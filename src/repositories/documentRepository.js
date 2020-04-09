const Pool = require("../postgres").Pool;

exports.persistDocument = async function persistDocument(documentInfo, documentBlob) {
    // upsert

    /*
    *
    *   create table if not exists documents (
    *       id: hashwert aus blob,
    *       documentname: string,
    *       documentblob: blob,
    *
    *   )
    *
    *   hashe das blob und gucke ob es schon in der DB ist
    *   wenn ja --> mache nichts und gib hash zurück
    *   wenn nein --> überschreibe eintrag
    * */
};

