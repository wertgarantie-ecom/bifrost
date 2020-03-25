const landingPageService = require('../services/landingPageService');

exports.getLandingPageData = async function getLandingPageData(req, res, next) {
    const clientId = req.params.publicClientId;
    try {
        const result = await landingPageService.prepareLandingPageData(clientId);
        if (!result) {
            return res.sendStatus(204);
        }
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}