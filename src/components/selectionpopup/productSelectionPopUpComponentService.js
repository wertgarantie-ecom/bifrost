const _productImageService = require('../../images/productImageService');
const _productOffersService = require("../../productoffers/productOffersService");
const productService = require("../../productoffers/productOfferFormattingService");
const documentTypes = require("../../documents/documentTypes").documentTypes;
const _clientService = require('../../clientconfig/clientService');
const schema = require('./productSelectionResponseSchema').productSelectionResponseSchema;
const _clientComponentTextService = require('../../clientconfig/clientComponentTextService');
const component = require('../components').components.selectionPopUp;
const Globalize = require('../globalize').Globalize;
const jsonschema = require('jsonschema');

exports.prepareProductSelectionData = async function prepareProductSelectionData(deviceClass,
                                                                                 devicePrice,
                                                                                 clientId,
                                                                                 locale = "de",
                                                                                 productOffersService = _productOffersService,
                                                                                 productImageService = _productImageService,
                                                                                 clientService = _clientService,
                                                                                 clientComponentTextService = _clientComponentTextService) {
    const globalize = Globalize.getInstance(locale);
    const client = await clientService.findClientForPublicClientId(clientId);

    const componentTexts = await clientComponentTextService.getComponentTexts(client.id, component.name);
    globalize.loadMessages(componentTexts);

    const productOffersData = await productOffersService.getProductOffers(client, deviceClass, devicePrice);
    const productOffers = productOffersData.productOffers;
    const products = [];
    let imageLinks = [];
    imageLinks = productImageService.getRandomImageLinksForDeviceClass(deviceClass, productOffers.length);
    productOffers.forEach((offer, idx) => {
        const product = convertPayloadToSelectionPopUpProduct(offer, imageLinks[idx], productOffers);
        products.push(product);
    });
    const data = {
        title: globalize.formatMessage("title"),
        products: products
    };
    return jsonschema.validate(data, schema);
};

function convertPayloadToSelectionPopUpProduct(productOffer, imageLink, allProductOffers) {
    const displayableProductOffer = productService.fromProductOffer(productOffer);
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
        IPIDText: displayableProductOffer.getDocument(documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION).name, // IPID
        IPIDUri: displayableProductOffer.getDocument(documentTypes.GENERAL_INSURANCE_PRODUCTS_INFORMATION).uri, // IPID
        priceFormatted: displayableProductOffer.getPriceFormatted(),
        taxFormatted: displayableProductOffer.getIncludedTaxFormatted(),
        imageLink: imageLink
    }
}

