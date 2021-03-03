import { NextFunction, Request, Response } from "express";
import { findAllClients } from "../../clientconfig/clientService";
// const clientService = require');

const getAllClients = async (req: Request, res: Response, next: NextFunction) => {

    // fetch clients
    const clients = await findAllClients().catch(e => next(e));

    console.log(clients)
    
    // render
    res.render('admin/start', {
        pageTitle: "AdminTest",
        // path: '/test',
        clients: clients
    })
}

export default {
    getAllClients: getAllClients
}
