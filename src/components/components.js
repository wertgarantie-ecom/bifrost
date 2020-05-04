const selectionPopUpTextsSchema = require('./selectionpopup/selectionPopUpTextsSchema');

exports.components = {
    rating: {
        name: "rating"
    },
    landingPage: {
        name: "landingpage"
    },
    selectionPopUp: {
        name: "selectionpopup",
        textsSchema: selectionPopUpTextsSchema
    },
    confirmation: {
        name: "confirmation"
    },
    afterSales: {
        name: "aftersales"
    }
}