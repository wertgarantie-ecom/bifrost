const selectionPopUpTextsSchema = require('./selectionpopup/selectionPopUpTextsSchema');

exports.components = {
    rating: {
        name: "rating"
    },
    landingpage: {
        name: "landingpage"
    },
    selectionpopup: {
        name: "selectionpopup",
        textsSchema: selectionPopUpTextsSchema
    },
    confirmation: {
        name: "confirmation"
    },
    aftersales: {
        name: "aftersales"
    }
}