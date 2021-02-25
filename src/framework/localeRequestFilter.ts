const availableLocales = ['de'];

export default function filterRequestLocale(req, res, next) {
    if (req.locale && req.locale.language && availableLocales.includes(req.locale.language)) {
        return next();
    }
    req.locale = {
        language: availableLocales[0]
    };
    return next();
};