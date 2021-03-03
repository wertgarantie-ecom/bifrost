import _basicAuth from "express-basic-auth";
import _clientRepository from '../clientconfig/clientRepository';
import isUUID from 'is-uuid';
import { NextFunction, Request, Response } from "express";

async function basicAuthByClientId(req: Request, res: Response, next: NextFunction, clientRepository = _clientRepository, basicAuth = _basicAuth, env = process.env) {
    const clientId: string = req.params.clientId;

    console.log("clientId");
    console.log(clientId, req.params.clientId);

    if (!isUUID.anyNonNil(clientId)) return res.sendStatus(400);

    const options = { users: {}, challenge: true };

    const clientConfig = await clientRepository.findClientById(req.params.clientId);

    if (clientConfig && clientConfig.basicAuthUser && clientConfig.basicAuthPassword) {
        options.users[clientConfig.basicAuthUser] = clientConfig.basicAuthPassword;
    }

    if (env.BASIC_AUTH_USER)
        options.users[env.BASIC_AUTH_USER] = env.BASIC_AUTH_PASSWORD;

    return basicAuth(options)(req, res, next);
}

export default basicAuthByClientId;