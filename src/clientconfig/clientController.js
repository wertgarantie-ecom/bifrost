const clientService = require('./clientService');
var StatsD = require('hot-shots');
var dogstatsd = new StatsD({mock: true});

exports.addNewClient = async function addNewClient(req, res, next) {

    const requestBody = req.body;
    try {
        const result = await clientService.addNewClient(requestBody);
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

exports.getAllClients = async function getAllClients(req, res, next) {
    const publicClientId = req.query.publicClientId;
    let clients;
    try {
        if (publicClientId) {
            clients = await clientService.findClientForPublicClientId(publicClientId);
        } else {
            clients = await clientService.findAllClients();
        }
        if (clients) {
            const result = {
                clients: clients
            };
            res.status(200).send(result);
        } else {
            res.status(204).send({
                message: "No clients found in database"
            })
        }
    } catch (e) {
        next(e);
    }
};

exports.getClientById = async function getClientById(req, res, next) {
    const id = req.params.clientId;
    try {
        const client = await clientService.findClientById(id);
        if (client) {
            res.status(200).send(client);
        } else {
            res.status(204).send({
                message: `No client found for id ${id}`
            })
        }
    } catch (e) {
        next(e);
    }
};

exports.updateWebservicesBackendConfig = async function updateWebservicesBackendConfig(req, res, next) {
    const clientId = req.params.clientId;
    const newBackendConfig = req.body;
    try {
        const updatedClient = await clientService.updateWebservicesBackendConfig(clientId, newBackendConfig); // if not deleted, exception is thrown
        res.status(200).send(updatedClient);
    } catch (e) {
        next(e);
    }
};

exports.deleteClient = async function deleteClient(req, res, next) {
    const idToDelete = req.params.clientId;
    try {
        const isDeleted = await clientService.deleteClientById(idToDelete); // if not deleted, exception is thrown
        res.status(200).send({
            id: idToDelete,
            deleted: isDeleted
        });
    } catch (e) {
        next(e);
    }
};