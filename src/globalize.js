const Globalize = require('globalize');
Globalize.load(require('cldr-data').entireSupplemental());
Globalize.load(require('cldr-data').entireMainFor("de", "en"));

var GlobalizeInstanceHolder = (function () {
    return {
        getInstance: (locale) => {
            if (!locale) {
                return new Globalize("de");
            }
            return new Globalize(locale);
        }
    };
})();

module.exports.Globalize = GlobalizeInstanceHolder;