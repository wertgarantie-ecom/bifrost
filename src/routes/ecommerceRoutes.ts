import express from 'express';
import { validate } from 'express-jsonschema';

import selectionPopUpController from '../components/selectionpopup/selectionPopUpController';
import selectionEmbeddedController from '../components/selectionembedded/selectionEmbeddedController';
import confirmationController from '../components/confirmation/confirmationController';
import afterSalesController from '../components/aftersales/afterSalesController';
import landingPageController from '../components/landingpage/landingPageController';
import loaderConfigController from '../components/loader/loaderConfigController';
import { selectionPopUpGetProductsSchema } from '../components/selectiongeneral/selectionGetProductsSchema';
import { productSelectionClickedSchema } from '../components/selectionembedded/productSelectionClickedSchema';
import { updateShoppingCartProductSchema } from '../components/selectionembedded/updateShoppingCartProductSchema';
import { removeFromShoppingCartEmbeddedSelectionSchema } from '../components/selectionembedded/removeFromShoppingCartEmbeddedSelectionSchema';
import {getGoogleReviewRating} from '../components/googlerating/googleController';

import { filterAndValidateBase64EncodedWebshopData } from '../shoppingcart/shoppingCartRequestFilter';
import { checkoutSchema } from '../shoppingcart/schemas/checkoutSchema';
import shoppingCartController from '../shoppingcart/shoppingCartController';
import { addShoppingCartProductSchema } from '../shoppingcart/schemas/addShoppingCartProductSchema';

import setClientConfigByPublicClientId from '../clientconfig/publicClientIdFilter';


const router = express.Router();

// components
router.get('/rating', getGoogleReviewRating);

// shop api
router.post('/shoppingCarts/current/checkout', validate({body: checkoutSchema}), shoppingCartController.checkoutCurrentShoppingCart);

router.put('/clients/:publicClientId/components/selection-popup', validate({body: selectionPopUpGetProductsSchema}), setClientConfigByPublicClientId, selectionPopUpController.getProducts);
router.post('/clients/:publicClientId/components/selection-popup/cancel', setClientConfigByPublicClientId, selectionPopUpController.popUpCanceled);

router.put('/clients/:publicClientId/components/selection-embedded', validate({body: selectionPopUpGetProductsSchema}), setClientConfigByPublicClientId, selectionEmbeddedController.getProducts);
router.post('/clients/:publicClientId/components/selection-embedded/product', validate({body: updateShoppingCartProductSchema}), setClientConfigByPublicClientId, selectionEmbeddedController.updateProductForOrderId);
router.delete('/clients/:publicClientId/components/selection-embedded/product', setClientConfigByPublicClientId, validate({body: removeFromShoppingCartEmbeddedSelectionSchema}), selectionEmbeddedController.removeProductFromShoppingCart);
router.post('/clients/:publicClientId/components/selection-embedded/select', validate({body: productSelectionClickedSchema}), setClientConfigByPublicClientId, selectionEmbeddedController.registerProductSelected);
router.delete('/clients/:publicClientId/components/selection-embedded/select', validate({body: productSelectionClickedSchema}), setClientConfigByPublicClientId, selectionEmbeddedController.registerProductUnselected);

router.put('/clients/:publicClientId/components/confirmation', setClientConfigByPublicClientId, confirmationController.getConfirmationComponentData);
router.put('/clients/:publicClientId/components/confirmation/:confirmationAttribute', setClientConfigByPublicClientId, confirmationController.confirmAttribute);
router.delete('/clients/:publicClientId/components/confirmation/product', setClientConfigByPublicClientId, confirmationController.removeProductFromShoppingCart);
router.delete('/clients/:publicClientId/components/confirmation/:confirmationAttribute', setClientConfigByPublicClientId, confirmationController.unconfirmAttribute);

router.get('/clients/:publicClientId/components/after-sales/:sessionId', setClientConfigByPublicClientId, afterSalesController.getAfterSalesData);
router.post('/clients/:publicClientId/components/after-sales/checkout', setClientConfigByPublicClientId, filterAndValidateBase64EncodedWebshopData, afterSalesController.componentCheckout);

router.get('/clients/:publicClientId/components/landing-page', setClientConfigByPublicClientId, landingPageController.getLandingPageData);
router.get('/clients/:publicClientId/loader-config', setClientConfigByPublicClientId, loaderConfigController.getLoaderConfig);

// shopping cart
router.post('/clients/:publicClientId/shoppingCart', validate({body: addShoppingCartProductSchema}), setClientConfigByPublicClientId, shoppingCartController.addProductToShoppingCart);

export default router;