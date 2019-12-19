const service = require('../services/confirmationComponentService.js');

exports.getConfirmationComponentData = function getConfirmationComponentData(req, res) {
    const clientId = req.query.clientId;
    const shoppingCart = req.signedCookies[clientId];

    const result = service.prepareConfirmationData(clientId, shoppingCart);

    res.status(200).send(result);
}