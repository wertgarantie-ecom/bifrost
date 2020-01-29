const clientService = require('../services/clientService');

exports.addNewClient = async function addNewClient(req, res, next) {
    const requestBody = req.body;
    try {
        const result = await clientService.addNewClient(requestBody);
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.getAllClients = async function getAllClients(req, res) {
    const clients = await clientService.findAllClients();
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
};

exports.deleteClient = async function deleteClient(req, res) {
    const idToDelete = req.body.clientId;
    const isDeleted = await clientService.deleteClientById(idToDelete); // if not deleted, exception is thrown
    res.status(200).send({
        id: idToDelete,
        deleted: isDeleted
    });
};