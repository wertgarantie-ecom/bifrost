exports.getBrowserLocale = function getBrowserLocale(req, res, next) {
    const browserLanguageSetting = req.get("accept-language");
    if (browserLanguageSetting) {
        req.userLocale = browserLanguageSetting.split(",")[0];
    }
    next();
};