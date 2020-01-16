const checkoutRespository = require("../repositories/CheckoutRepository");

exports.findPurchaseById = async function findPurchaseById(req, res) {
    const sessionId = req.params.sessionId;
    const result = await checkoutRespository.findBySessionId(sessionId);
    if (result) {
        res.send(result);
    } else {
        res.sendStatus(404);
    }
};