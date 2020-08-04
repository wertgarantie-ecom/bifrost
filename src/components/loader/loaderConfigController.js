exports.getLoaderConfig = async function getLoaderConfig(req, res, next) {
    if (!req.clientConfig || !req.clientConfig.loaderConfig) {
        return res.sendStatus(204);
    }
    return res.status(200).send(req.clientConfig.loaderConfig);
};