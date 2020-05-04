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

exports.findAllCheckouts = async function findAllCheckouts(req, res, next) {
    const limit = req.query.limit || 50;
    try {
        const result = await checkoutRespository.findAll(limit);
        if (result) {
            return res.status(200).send(result);
        }
        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
};