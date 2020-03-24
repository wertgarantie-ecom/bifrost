const _service = require('../services/productSelectionPopUpComponentService.js');

exports.getProducts = async function getProducts(req, res, next, service = _service) {
    if (!(req.query.deviceClass && req.query.devicePrice && req.query.clientId)) {
        res.status(400).send({message: "device class, device price and client ID are required fields"})
    }
    try {
        const validatorResult = await service.prepareProductSelectionData(req.query.deviceClass, req.query.devicePrice, req.query.clientId);
        if (!validatorResult.valid) {
            return res.status(502).send(validatorResult.errors);
        } else {
            return res.status(200).send(validatorResult.instance);
        }
    } catch (e) {
        next(e);
    }
};
