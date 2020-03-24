const service = require('../services/productSelectionPopUpComponentService.js');

exports.getProducts = async function getProducts(req, res, next) {
    if (!(req.query.deviceClass && req.query.devicePrice && req.query.clientId)) {
        res.status(400).send({message: "device class, device price and client ID are required fields"})
    }
    try {
        const data = await service.prepareProductSelectionData(req.query.deviceClass, req.query.devicePrice, req.query.clientId);
        res.send(data);
    } catch (e) {
        next(e);
    }
};
