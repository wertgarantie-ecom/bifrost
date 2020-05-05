const clientComponentTextService = require('./clientComponentTextService');

exports.saveComponentTextForClient = async function saveComponentTextForClient(req, res, next) {
    const clientId = req.params.clientId;
    try {
        const result = await clientComponentTextService.saveNewComponentTextsForClientId(clientId, req.body.locale, req.body.component, req.body.componentTexts);
        return res.status(200).send({
            message: `updated ${req.body.component} for client ${clientId}`,
            newTexts: result
        });
    } catch (error) {
        return next(error);
    }
};

exports.getAllComponentTextsForClient = async function getAllComponentTextsForClient(req, res, next) {
    const clientId = req.params.clientId;
    try {
        const result = await clientComponentTextService.getAllComponentTextsForClient(clientId);
        if (!result) {
            return res.sendStatus(204);
        }
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}