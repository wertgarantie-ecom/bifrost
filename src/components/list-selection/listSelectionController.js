const listSelectionService = require('./listSelectionService');

exports.getListSelectionData = async function getListSelectionData(req, res) {
    const clientConfig = req.clientConfig;
    const shopShoppingCart = req.body.shopShoppingCart ? JSON.parse(Buffer.from(req.body.shopShoppingCart, 'base64').toString()) : undefined;

    const result = await listSelectionService.prepareListSelectionData(clientConfig, shopShoppingCart);
    if (result) {
        return res.status(200).send(result);
    }
    return res.sendStatus(204);
};