import { NextFunction, Request, Response } from "express";

const getAllClients = (req: Request, res: Response, next: NextFunction) => {
    const hello = "world";

    // TODO CSS 
    res.render('admin/start', {
        pageTitle: "AdminTest",
        path: 'admin/start',
        hello: hello
    })
}

export default {
    getAllClients: getAllClients
}
