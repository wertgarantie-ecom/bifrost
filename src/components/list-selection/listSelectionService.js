const componentTextsService = require('../../clientconfig/clientComponentTextService');
const component = require('../components').components.listselection;
const validator = require('../../framework/validation/validator');
const listSelectionResponseSchema = require('./listSelectionResponseSchema').listSelectionResponseSchema;
const embeddedSelectionService = require('../selectionembedded/selectionEmbeddedService');
const _ = require('lodash');

exports.prepareListSelectionData = async function prepareListSelectionData(clientConfig, shopShoppingCart, locale = 'de', ) {
    const listSelectionTexts = await componentTextsService.getComponentTextsForClientAndLocal(clientConfig.id, component.name, locale);

    const insurableProductRows = await Promise.all(shopShoppingCart.map(async shopProduct => {
        const embeddedSelectionData = await embeddedSelectionService.prepareProductSelectionData(shopProduct.deviceClass, shopProduct.price, clientConfig, locale);
        if (embeddedSelectionData) {
            const embeddedSelectionDataBase64 = Buffer.from(JSON.stringify(embeddedSelectionData)).toString('base64');
            return {
                shopProductImageLink: shopProduct.imageLink,
                shopProductName: shopProduct.name,
                embeddedSelectionDataBase64
            }
        } else {
            return undefined;
        }
    }));

    const cleanedInsurableProductRows = _.compact(insurableProductRows);

    if (cleanedInsurableProductRows.length < 1) {
        return undefined;
    }

    const result = {
        insurableProductRows: cleanedInsurableProductRows,
        listSelectionComponentTexts: listSelectionTexts
    };

    validator.validate(result, listSelectionResponseSchema);

    return result;
};
