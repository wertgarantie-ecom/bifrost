const service = require('./shoppingCartService');
const clientRepository = require('../clientconfig/ClientRepository');
const clientService = require('../clientconfig/clientService');
const ClientError = require('../errors/ClientError');

/**
 * Add given product to existing or new shopping cart.
 */
exports.addProductToShoppingCart = async function addProductToShoppingCart(req, res) {
    const publicClientId = req.params.clientId;
    const client = await clientRepository.findClientForPublicClientId(publicClientId);
    if (!client) {
        return res.status(400).send({
            message: "Unknown Client Id"
        });
    }
    const shoppingCart = service.addProductToShoppingCart(req.shoppingCart, req.body, publicClientId);

    res.status(200).send({
        shoppingCart: shoppingCart,
        message: "Added product to shopping cart",
        addedProduct: req.body
    });
};

function sendErrorResponse(res, error, errorMessage) {
    res.status(400).send({
        error: error,
        message: errorMessage
    })
}

exports.checkoutCurrentShoppingCart = async function checkoutCurrentShoppingCart(req, res, next) {
    if (!req.shoppingCart) {
        res.status(200).send({
            message: `No Wertgarantie products were provided for checkout call. In this case, the API call to Wertgarantie-Bifrost is not needed.`
        });
    } else {
        try {
            const client = await clientService.findClientForSecret(req.body.secretClientId);
            if (!client) {
                const errorMessage = "No client found for given client id: " + req.body.secretClientId;
                sendErrorResponse(res, new ClientError(errorMessage));
            }
            const result = await service.checkoutShoppingCart(req.body.purchasedProducts, req.body.customer, req.shoppingCart, client);
            res.status(200).send(result);
        } catch (error) {
            if (error instanceof SyntaxError) { //JSON.parse fails
                sendErrorResponse(res, error, "Corrupt JSON provided as wertgarantie shopping cart. Checkout call will not be processed.");
            } else {
                next(error);
            }
        }
    }
};
