import {NextFunction, Request, Response} from "express";

const _findBySessionId = require('./checkoutRepository').findBySessionId;
const _verifyShoppingCart = require('./signatureService').verifyShoppingCart;
const ClientError = require('../errors/ClientError');
const isBase64 = require('is-base64');
const isUUID = require('is-uuid');
const SESSION_ID_HEADER = 'X-wertgarantie-session-id';
const afterSalesComponentCheckoutSchema = require('../components/aftersales/afterSalesComponentCheckoutSchema').afterSalesComponentCheckoutSchema;
const validate = require('../framework/validation/validator').validate;
const signedShoppingCartSchema = require('./schemas/signedShoppingCartSchema').signedSchoppingCartSchema;
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

export function detectBase64EncodedRequestBody(req: Request, res: Response, next: NextFunction): void {
    const signedShoppingCart = req.body.signedShoppingCart;
    const options = {allowEmpty: false};
    if (isBase64(signedShoppingCart, options)) {
        const buffer = Buffer.from(signedShoppingCart, 'base64');
        const signedShoppingCartString = buffer.toString('utf8');
        req.body.signedShoppingCart = JSON.parse(signedShoppingCartString);
    }
    next();
}

export function filterAndValidateBase64EncodedWebshopData(req: Request, res: Response, next: NextFunction): void {
    let webshopData = Buffer.from(req.body.webshopData, 'base64').toString('utf8');
    webshopData = entities.decode(webshopData);
    webshopData = JSON.parse(webshopData);
    try {
        validate(webshopData, afterSalesComponentCheckoutSchema);
        req.body.webshopData = webshopData;
    } catch (error) {
        return next(error);
    }
    return next();
}

export async function checkSessionIdCheckout(req: Request, res: Response, next: NextFunction, findBySessionId = _findBySessionId): Promise<void> {
    const sessionId = req.get(SESSION_ID_HEADER);
    if (sessionId === undefined) {
        return next();
    } else if (isUUID.anyNonNil(sessionId)) {
        try {
            const result = await findBySessionId(sessionId);
            if (result) {
                deleteShoppingCart(req, res);
            }
            return next();
        } catch (error) {
            return next(error);
        }
    } else {
        const clientError = new ClientError(`only uuids are allowed as session id header. Received ${SESSION_ID_HEADER}=${sessionId}`);
        return next(clientError);
    }
}

type ECommerceRequest = Request & {
    shoppingCart: any
}


export function validateShoppingCart(req: ECommerceRequest, res: Response, next: NextFunction, verifyShoppingCart = _verifyShoppingCart) {
    if (!(req.body && req.body.signedShoppingCart)) {
        console.log("Empty body and/or shopping cart not available. Nothing to validate.");
        return next();
    }

    const signedShoppingCart = req.body.signedShoppingCart;

    try {
        validate(signedShoppingCart, signedShoppingCartSchema);
    } catch (err) {
        deleteShoppingCart(req, res)
        console.error("invalid shopping cart provided: " + JSON.stringify(err, null, 2));
        return next();
    }

    if (!verifyShoppingCart(signedShoppingCart)) {
        deleteShoppingCart(req, res)
        console.error("shopping cart with invalid signature" + JSON.stringify(signedShoppingCart, null, 2));
        return next()
    } else {
        req.shoppingCart = signedShoppingCart.shoppingCart;
        return next();
    }
}


function deleteShoppingCart(req: Request, res: Response) {
    if (req.body) {
        delete req.body.signedShoppingCart;
    }
    res.set('X-wertgarantie-shopping-cart-delete', "true");
}