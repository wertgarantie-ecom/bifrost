import { NextFunction, Request, Response } from "express";

export const errorService = (err, req: Request, res: Response, next: NextFunction) => {

    switch (err.name) {
        case "JsonSchemaValidation":
            err.status = 400;
            err.message = { receivedBody: req.body, validations: err.validations };
        case "ValidationError":
            err.status = 400;
            err.message = { validations: err.errors, received: err.instance };
        case "WebserviceError": err.status = 400;
        case "InvalidClientIdError": err.status = 400;
        case "InvalidClientData": err.status = 400;
        case "ClientError": err.status = 400;
        case "ProductOffersError": err.status = 400;
        case "UnknownInsuranceProposalError": err.status = 400;
    }

    if (err.validations) console.error(JSON.stringify(err, null, 2));
    else console.error(err);

    res.status(err.status || 500).json({ error: err.name, message: err.message });
}