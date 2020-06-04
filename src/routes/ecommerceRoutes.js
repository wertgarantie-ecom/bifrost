const express = require('express');
const router = express.Router();

const selectionPopUpController = require("../components/selectionpopup/selectionPopUpController");
const selectionEmbeddedController = require("../components/selectionembedded/selectionEmbeddedController");
const confirmationController = require("../components/confirmation/confirmationController");
const afterSalesController = require("../components/aftersales/afterSalesController");
const landingPageController = require("../components/landingpage/landingPageController");
const addShoppingCartProductSchema = require("../shoppingcart/schemas/addShoppingCartProductSchema").addShoppingCartProductSchema;
const selectionGetProductsSchema = require("../components/selectiongeneral/selectionGetProductsSchema").selectionPopUpGetProductsSchema;
const shoppingCartController = require("../shoppingcart/shoppingCartController");
const filterAndValidateBase64EncodedWebshopData = require("../shoppingcart/shoppingCartRequestFilter").filterAndValidateBase64EncodedWebshopData;
const validate = require('express-jsonschema').validate;
const googleController = require("../components/googlerating/googleController");
const checkoutSchema = require("../shoppingcart/schemas/checkoutSchema").checkoutSchema;
const setClientConfigByPublicClientId = require('../clientconfig/publicClientIdFilter');

// components
router.get("/rating", googleController.reviewRatings);

// shop api
router.post("/shoppingCarts/current/checkout", validate({body: checkoutSchema}), shoppingCartController.checkoutCurrentShoppingCart);

router.put("/clients/:publicClientId/components/selection-popup", validate({body: selectionGetProductsSchema}), setClientConfigByPublicClientId, selectionPopUpController.getProducts);
router.post("/clients/:publicClientId/components/selection-popup/cancel", setClientConfigByPublicClientId, selectionPopUpController.popUpCanceled);

router.put("/clients/:publicClientId/components/selection-embedded", validate({body: selectionGetProductsSchema}), setClientConfigByPublicClientId, selectionEmbeddedController.getProducts);

router.put("/clients/:publicClientId/components/confirmation", setClientConfigByPublicClientId, confirmationController.getConfirmationComponentData);
router.put("/clients/:publicClientId/components/confirmation/:confirmationAttribute", setClientConfigByPublicClientId, confirmationController.confirmAttribute);
router.delete("/clients/:publicClientId/components/confirmation/product", setClientConfigByPublicClientId, confirmationController.removeProductFromShoppingCart);
router.delete("/clients/:publicClientId/components/confirmation/:confirmationAttribute", setClientConfigByPublicClientId, confirmationController.unconfirmAttribute);

router.get("/clients/:publicClientId/components/after-sales/:sessionId", setClientConfigByPublicClientId, afterSalesController.getAfterSalesData);
router.post("/clients/:publicClientId/components/after-sales/checkout", setClientConfigByPublicClientId, filterAndValidateBase64EncodedWebshopData, afterSalesController.componentCheckout);

router.get("/clients/:publicClientId/components/landing-page", setClientConfigByPublicClientId, landingPageController.getLandingPageData);

// shopping cart
router.post("/clients/:publicClientId/shoppingCart", validate({body: addShoppingCartProductSchema}), setClientConfigByPublicClientId, shoppingCartController.addProductToShoppingCart);

module.exports = router;
