const documentRepo = require('./documentRepository');


exports.getDocumentById = async function getDocumentById(req, res, next) {
    try {
        const documentId = req.params.documentId;
        if (!documentId) {
            return res.status(400).send("Document ID is required");
        }
        const document = await documentRepo.findById(documentId);
        if (!document) {
           return res.status(204).send("no document found for id " + documentId);
        }
        const buff = Buffer.from(document.content, 'base64');
        res.set("Content-Type", "application/pdf");
        res.set("Content-Disposition", "attachment; filename=" + document.name);
        return res.status(200).send(buff);
    } catch (error) {
        next(error);
    }
};