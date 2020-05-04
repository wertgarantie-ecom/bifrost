const clientComponentTextService = require('./clientComponentTextService');

exports.saveComponentTextForClient = async function saveComponentTextForClient(req, res, next) {
    const clientId = req.params.clientId;
    const componentName = req.params.componentName;
    const componentTexts = req.body;

    try {
        const result = await clientComponentTextService.saveNewComponentTextsForClientId(clientId, componentName, componentTexts);
        res.status(200).send({
            message: `updated ${componentName} for client ${clientId}`,
            newTexts: result
        });
    } catch (error) {
        next(error);
    }
};