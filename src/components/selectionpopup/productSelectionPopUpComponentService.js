const _productImageService = require('../../images/productImageService');
const _productOffersService = require("../../productoffers/productOffersService");
const productService = require("../../productoffers/productOfferFormattingService");
const documentTypes = require("../../documents/documentTypes").documentTypes;
const _clientService = require('../../clientconfig/clientService');
const schema = require('./productSelectionResponseSchema').productSelectionResponseSchema;
const _clientComponentTextService = require('../../clientconfig/clientComponentTextService');
const componentName = "selectionpopup";
const validate = require('../../framework/validation/validator').validate;
const util = require('util');

exports.prepareProductSelectionData = async function prepareProductSelectionData(deviceClass,
                                                                                 devicePrice,
                                                                                 clientId,
                                                                                 locale = "de",
                                                                                 productOffersService = _productOffersService,
                                                                                 productImageService = _productImageService,
                                                                                 clientService = _clientService,
                                                                                 clientComponentTextService = _clientComponentTextService) {
    const client = await clientService.findClientForPublicClientId(clientId);

    const productOffersData = await productOffersService.getProductOffers(client, deviceClass, devicePrice);
    const productOffers = productOffersData.productOffers;
    const products = [];
    let imageLinks = [];
    imageLinks = productImageService.getRandomImageLinksForDeviceClass(deviceClass, productOffers.length);
    const popUpTexts = await clientComponentTextService.getComponentTextsForClientAndLocal(client.id, componentName, locale);
    productOffers.forEach((offer, idx) => {
        const product = convertPayloadToSelectionPopUpProduct(offer, imageLinks[idx], productOffers, locale, popUpTexts);
        products.push(product);
    });

    this.products = products;

    const data = {
        texts: popUpTexts,
        products: products
    };
    data.texts.footerHtml = util.format(popUpTexts.footerHtml, popUpTexts.partnerShop);

    return validate(data, schema);
};

function convertPayloadToSelectionPopUpProduct(productOffer, imageLink, allProductOffers, locale, popUpTexts) {
    const displayableProductOffer = productService.fromProductOffer(productOffer, popUpTexts);
    productOffer.payment = displayableProductOffer.getPaymentInterval();

    const advantageCategories = displayableProductOffer.getAdvantageCategories(allProductOffers);
    return {
        paymentInterval: productOffer.payment,
        id: productOffer.id,
        name: productOffer.name,
        top3: advantageCategories.top3,
        advantages: advantageCategories.advantages,
        excludedAdvantages: advantageCategories.excludedAdvantages || [],
        GTCIText: displayableProductOffer.getDocument(documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE).name, // GTCI
        GTCIUri: displayableProductOffer.getDocument(documentTypes.GENERAL_TERMS_AND_CONDITIONS_OF_INSURANCE).uri, // GTCI --> naming hier auch ändern infoSheet und detailsDoc is scheiße
        IPIDText: displayableProductOffer.getDocument(documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION,).name, // IPID
        IPIDUri: displayableProductOffer.getDocument(documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION).uri, // IPID
        priceFormatted: displayableProductOffer.getPriceFormatted(locale),
        taxFormatted: displayableProductOffer.getIncludedTaxFormatted(locale),
        imageLink: imageLink
    }
}

