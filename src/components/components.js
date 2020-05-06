const ratingTextsSchema = require('./googlerating/ratingTextsSchema');
const landingPageTextsSchema = require('./landingpage/landingPageTextsSchema');
const selectionPopUpTextsSchema = require('./selectionpopup/selectionPopUpTextsSchema');
const confirmationTextsSchema = require('./confirmation/confirmationTextsSchema');
const afterSalesTextsSchema = require('./aftersales/afterSalesTextsSchema');

exports.components = {
    rating: {
        textsSchema: ratingTextsSchema
    },
    landingpage: {
        textsSchema: landingPageTextsSchema
    },
    selectionpopup: {
        textsSchema: selectionPopUpTextsSchema
    },
    confirmation: {
        textsSchema: confirmationTextsSchema
    },
    aftersales: {
        textsSchema: afterSalesTextsSchema
    }
}