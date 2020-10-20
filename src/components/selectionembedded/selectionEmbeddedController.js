const service = require('./selectionEmbeddedService');
const ClientError = require('../../errors/ClientError');
const shoppingCartService = require('../../shoppingcart/shoppingCartService');

exports.getProducts = async function getProducts(req, res, next) {
    const shopDeviceClasses = req.body.deviceClass ? req.body.deviceClass : req.body.deviceClasses;
    if (!shopDeviceClasses) {
        throw new ClientError("no shop device class provided!");
    }
    const devicePrice = req.body.devicePrice;
    const condition = req.body.deviceCondition;

    try {
        const result = await service.getProductOffers(shopDeviceClasses, devicePrice, req.clientConfig, req.locale.language, req.shoppingCart, req.useragent, condition);
        if (result.products.length > 0) {
            return res.status(200).send(result);
        }
        return res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

exports.removeProductFromShoppingCart = async function removeProductFromShoppingCart(req, res, next) {
    try {
        const updatedShoppingCart = await service.removeProductFromShoppingCart(req.body.orderId, req.shoppingCart, req.clientConfig.name);

        if (updatedShoppingCart) {
            return res.status(200).send({
                shoppingCart: updatedShoppingCart,
                message: `OrderId ${req.body.orderId} removed from shoppingCart`
            });
        } else {
            return sendEmptyShoppingCart(res);
        }
    } catch (error) {
        return next(error);
    }
};

exports.updateProductForOrderId = async function updateProductForOrderId(req, res, next) {
    try {
        let updatedShoppingCart;
        if (!req.shoppingCart) {
            const productToAdd = {
                wertgarantieProduct: req.body.wertgarantieProduct,
                shopProduct: req.body.shopProduct
            }
            updatedShoppingCart = await shoppingCartService.addProductToShoppingCart(undefined, productToAdd, req.clientConfig, req.body.orderId);
        } else {
            updatedShoppingCart = shoppingCartService.updateShoppingCart(req.shoppingCart, req.body.orderId, req.body.shopProduct, req.body.wertgarantieProduct);
        }
        return res.status(200).send({
            shoppingCart: updatedShoppingCart,
            message: `Updated OrderId ${req.body.orderId}`,
            newProduct: req.body.wertgarantieProduct
        });
    } catch (error) {
        return next(error);
    }
};

exports.registerProductSelected = async function registerProductSelected(req, res) {
    // const selectedProduct = req.body;
    // metrics here
    res.sendStatus(204);
};


exports.registerProductUnselected = async function registerProductUnselected(req, res) {
    // const unselectedProduct = req.body;
    // metrics here
    res.sendStatus(204);
};

function sendEmptyShoppingCart(res) {
    res.set('X-wertgarantie-shopping-cart-delete', true);
    res.sendStatus(204);
}

