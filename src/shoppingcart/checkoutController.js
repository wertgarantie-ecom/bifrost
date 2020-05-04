const checkoutRespository = require("./checkoutRepository");

exports.findPurchaseById = async function findPurchaseById(req, res) {
    const sessionId = req.params.sessionId;
    const result = await checkoutRespository.findBySessionId(sessionId);
    if (result) {
        res.send(result);
    } else {
        res.sendStatus(404);
    }
};

exports.findAllCheckouts = async function findAllCheckouts(req, res) {
    const limit = req.params.query || 50;
    const result = await checkoutRespository.findAllCheckouts(limit);
    res.send(result);
};