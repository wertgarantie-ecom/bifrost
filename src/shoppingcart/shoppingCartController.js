const service = require('./shoppingCartService');
const clientService = require('../clientconfig/clientService');
const ClientError = require('../errors/ClientError');

/**
 * Add given product to existing or new shopping cart.
 */
exports.addProductToShoppingCart = async function addProductToShoppingCart(req, res) {
    const addResult = await service.addProductToShoppingCart(req.shoppingCart, req.body, req.clientConfig);

    res.status(200).send({
        shoppingCart: addResult.shoppingCart,
        message: "Added product to shopping cart",
        addedProduct: req.body,
        orderId: addResult.orderId
    });
};

function sendErrorResponse(res, error, errorMessage) {
    res.status(400).send({
        error: error,
        message: errorMessage
    })
}

exports.checkoutCurrentShoppingCart = async function checkoutCurrentShoppingCart(req, res, next) {
    if (res.get("X-wertgarantie-shopping-cart-delete")) {
        return res.status(400).send({
            message: `Invalid shopping cart provided. Checkout call will not be processed`
        })
    }
    if (!req.shoppingCart) {
        return res.status(200).send({
            message: `No Wertgarantie products were provided for checkout call. In this case, the API call to Wertgarantie-Bifrost is not needed.`
        });
    } else {
        try {
            const client = await clientService.findClientForSecret(req.body.secretClientId);
            if (!client) {
                const errorMessage = "No client found for given client id: " + req.body.secretClientId;
                sendErrorResponse(res, new ClientError(errorMessage));
            }
            const result = await service.checkoutShoppingCart(req.body.purchasedProducts, req.body.customer, req.body.orderId, req.shoppingCart, client);
            return res.status(200).send(result);
        } catch (error) {
            if (error instanceof SyntaxError) { //JSON.parse fails
                sendErrorResponse(res, error, "Corrupt JSON provided as wertgarantie shopping cart. Checkout call will not be processed.");
            } else {
                next(error);
            }
        }
    }
};
