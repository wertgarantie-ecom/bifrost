const Globalize = require('globalize');
Globalize.load(require('cldr-data').entireSupplemental());
Globalize.load(require('cldr-data').entireMainFor("de", "en"));

module.exports.Globalize = Globalize;