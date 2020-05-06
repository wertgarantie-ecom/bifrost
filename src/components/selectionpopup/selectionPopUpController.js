const _service = require('./productSelectionPopUpComponentService.js');

exports.getProducts = async function getProducts(req, res, next, service = _service) {
    if (!(req.query.deviceClass && req.query.devicePrice && req.query.clientId)) {
        res.status(400).send({message: "device class, device price and client ID are required fields"})
    }
    try {
        const validatorResult = await service.prepareProductSelectionData(req.query.deviceClass, req.query.devicePrice, req.query.clientId, req.locale.language);
        if (!validatorResult.valid) {
            return res.status(502).send(validatorResult.errors);
        } else {
            if (validatorResult.instance.products.length !== 2) {
                return res.status(204).send("could not assemble two product offers");
            }
            return res.status(200).send(validatorResult.instance);
        }
    } catch (e) {
        next(e);
    }
};
