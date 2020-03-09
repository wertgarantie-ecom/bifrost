const service = require('../services/shoppingCartService');
const clientRepository = require('../repositories/ClientRepository');

/**
 * Add given product to existing or new shopping cart.
 */
exports.addProductToShoppingCart = async function addProductToShoppingCart(req, res) {
    const publicClientId = req.params.clientId;
    const client = await clientRepository.findClientForPublicClientId(publicClientId);
    if (!client) {
        return res.status(400).send({
            message: "Unknown Client Id"
        })
    }
    const wertgarantieProductToAdd = {
        wertgarantieProductId: parseInt(req.body.productId),
        wertgarantieProductName: req.body.productName,
        deviceClass: req.body.deviceClass,
        devicePrice: parseInt(req.body.devicePrice),
        deviceCurrency: req.body.deviceCurrency,
        shopProductName: req.body.shopProductName
    };
    const shoppingCart = service.addProductToShoppingCart(req.shoppingCart, wertgarantieProductToAdd, publicClientId);

    res.status(200).send({
        shoppingCart: shoppingCart,
        message: "Added product to shopping cart",
        addedProduct: wertgarantieProductToAdd
    });
};

exports.checkoutCurrentShoppingCart = async function checkoutCurrentShoppingCart(req, res, next) {
    if (!req.shoppingCart) {
        res.status(200).send({
            message: `No Wertgarantie products were provided for checkout call. In this case, the API call to Wertgarantie-Bifrost is not needed.`
        });
    } else {
        try {
            const result = await service.checkoutShoppingCart(req.body.purchasedProducts, req.body.customer, req.shoppingCart, req.body.secretClientId);
            res.status(200).send(result);
        } catch (error) {
            if (error instanceof SyntaxError) { //JSON.parse fails
                res.status(400).send({
                    error: error,
                    message: "Corrupt JSON provided as wertgarantie shopping cart. Checkout call will not be processed."
                })
            } else {
                next(error);
            }
        }
    }
};
