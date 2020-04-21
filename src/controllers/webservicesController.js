const webservicesProductOffersAssembler = require('../services/webservicesProductOffersAssembler');
const productOffersRepository = require('../repositories/productOffersRepository');
const clientService = require('../services/clientService');

exports.triggerProductOffersAssembly = async function triggerProductOffersAssembly(req, res, next) {
    try {
        await webservicesProductOffersAssembler.updateProductOffersForAllClients();
        return res.status(200).send("updated all webservices product offers for all clients");
    } catch (error) {
        return next(error);
    }
};

exports.triggerProductOffersAssemblyForClient = async function triggerProductOffersAssemblyForClient(req, res, next) {
    try {
        if (!req.params.clientId) {
            return res.status(400).send("clientId is required");
        }
        const client = await clientService.findClientById(req.params.clientId);
        if (!client) {
            return res.status(400).send("nothing found for client id: " + req.params.clientId);
        }
        await webservicesProductOffersAssembler.updateAllProductOffersForClient(client)
        return res.status(200).send("product offers updated for client: " + client.id);
    } catch (error) {
        return next(error);
    }
};

exports.getProductOffersForClient = async function getProductOffersForClient(req, res, next) {
    try {
        if (!req.params.clientId) {
            return res.status(400).send("clientId is required");
        }
        const client = await clientService.findClientById(req.params.clientId);
        if (!client) {
            return res.status(400).send("nothing found for client id: " + req.params.clientId);
        }
        const productOffers = await productOffersRepository.findByClientId(client.id);
        if (!productOffers) {
            res.sendStatus(204);
        }
        return res.status(200).send(productOffers);
    } catch (error) {
        return next(error);
    }
}