const landingPageService = require('./landingPageService');

exports.getLandingPageData = async function getLandingPageData(req, res, next) {
    try {
        const result = await landingPageService.showLandingPage(req.clientConfig);
        if (!result) {
            return res.sendStatus(204);
        }
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}