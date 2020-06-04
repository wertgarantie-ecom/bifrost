const ratingTextsSchema = require('./googlerating/ratingTextsSchema');
const landingPageTextsSchema = require('./landingpage/landingPageTextsSchema');
const selectionPopUpTextsSchema = require('./selectionpopup/selectionPopUpTextsSchema');
const confirmationTextsSchema = require('./confirmation/confirmationTextsSchema');
const afterSalesTextsSchema = require('./aftersales/afterSalesTextsSchema');
const selectionEmbeddedTextsSchema = require('./selectionembedded/selectionEmbeddedTextsSchema');

exports.components = {
    rating: {
        name: "rating",
        textsSchema: ratingTextsSchema
    },
    landingpage: {
        name: "landingpage",
        textsSchema: landingPageTextsSchema
    },
    selectionpopup: {
        name: "selectionpopup",
        textsSchema: selectionPopUpTextsSchema
    },
    selectionembedded: {
        name: "selectionembedded",
        textsSchema: selectionEmbeddedTextsSchema
    },
    confirmation: {
        name: "confirmation",
        textsSchema: confirmationTextsSchema
    },
    aftersales: {
        name: "aftersales",
        textsSchema: afterSalesTextsSchema
    }
}