import createError from 'http-errors';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import sslRedirect from 'heroku-ssl-redirect';
import bodyParser from 'body-parser';
import localeParser from 'express-locale';
import useragent from 'express-useragent';
import basicAuth from 'express-basic-auth';
import localeFilter from './framework/localeRequestFilter'
import setUpAccessLogger from "./middlewares/accessLogger";

// Import routes
import adminRoutes from './routes/adminRoutes';
import adminUIRoutes from './routes/adminUIRoutes';
import ecommerceRoutes from './routes/ecommerceRoutes';
import { detectBase64EncodedRequestBody, checkSessionIdCheckout, validateShoppingCart } from "./shoppingcart/shoppingCartRequestFilter";
import shoppingCartResponseFilter from "./shoppingcart/shoppingCartResponseFilter";
import { errorHandling } from "./routes/errorHandling";

// dotenv
dotenv.config({ path: path.join(__dirname, '../',`config/${process.env.NODE_ENV}.env`) });

// vars
const app = express();
const user = process.env.BASIC_AUTH_USER;
const password = process.env.BASIC_AUTH_PASSWORD;
const basicAuthUsers = {};
if (user) basicAuthUsers[user] = password;
const corsOptions: object = {
    origin: true,
    credentials: true,
    exposedHeaders: [
        'X-wertgarantie-shopping-cart-delete'
    ]
};

// middlewares
app.use(useragent.express());
app.use(bodyParser.json())
app.use(setUpAccessLogger());
app.use(express.json());
app.use(localeParser(), localeFilter);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

// TODO Check
//@ts-ignore
app.options('*', cors(corsOptions));

app.use(sslRedirect(['production', 'dev', 'staging']));
app.use(shoppingCartResponseFilter);

// routes
app.use('/healthcheck', require('express-healthcheck')());
app.use('/heroku', require('./heroku/herokuController'));
app.use('/wertgarantie/', detectBase64EncodedRequestBody);
app.use('/wertgarantie/', checkSessionIdCheckout);
app.use('/wertgarantie/', validateShoppingCart);
app.use('/wertgarantie/', adminRoutes);
app.use('/wertgarantie/ecommerce/', ecommerceRoutes);

app.use('/admin/', basicAuth({ users: basicAuthUsers, challenge: true }));
app.use('/admin/', adminUIRoutes);

// catch 404 and forward to error handler
app.use('*', (req: Request, res: Response, next: NextFunction) => next(createError(404, "Page not available")));

// error handling | route comes last
app.use(errorHandling);


export default app;
// module.exports = app;
