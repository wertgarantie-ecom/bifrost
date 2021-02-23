const createError = require('http-errors');
const express = require('express');
require('express-async-errors');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const sslRedirect = require('heroku-ssl-redirect');
const bodyParser = require('body-parser');
const localeParser = require('express-locale')();
const localeFilter = require('./framework/localeRequestFilter');
const expressWinston = require('express-winston');
const winston = require('winston');
const useragent = require('express-useragent');

const resolvedPath = path.resolve(`config/${process.env.NODE_ENV}.env`);
dotenv.config({path: resolvedPath});

if (!process.env.METRICS_ENABLED) {
    console.error("could not read config env file");
}

const adminRoutes = require('./routes/adminRoutes');
const ecommerceRoutes = require('./routes/ecommerceRoutes');
const detectBase64EncodedRequestBody = require('./shoppingcart/shoppingCartRequestFilter').detectBase64EncodedRequestBody;
const checkSessionIdCheckout = require('./shoppingcart/shoppingCartRequestFilter').checkSessionIdCheckout;
const validateShoppingCartRequest = require('./shoppingcart/shoppingCartRequestFilter').validateShoppingCart;
const basicAuth = require('express-basic-auth');
const adminUIRoutes = require('./routes/adminUIRoutes');

const app = express();

app.use(useragent.express());
app.use(bodyParser.json());
app.use(setUpAccessLogger());
app.use(express.json());
app.use(localeParser, localeFilter);
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

var corsOptions = {
    origin: true,
    credentials: true,
    exposedHeaders: [
        'X-wertgarantie-shopping-cart-delete'
    ]
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(sslRedirect(['production', 'dev', 'staging']));

app.use(require('./shoppingcart/shoppingCartResponseFilter'));
app.use('/healthcheck', require('express-healthcheck')());
app.use('/heroku', require('./heroku/herokuController'));
app.use('/wertgarantie/', detectBase64EncodedRequestBody);
app.use('/wertgarantie/', checkSessionIdCheckout);
app.use('/wertgarantie/', validateShoppingCartRequest);
app.use('/wertgarantie/', adminRoutes);
app.use('/wertgarantie/ecommerce/', ecommerceRoutes);

const user = process.env.BASIC_AUTH_USER;
const password = process.env.BASIC_AUTH_PASSWORD;
const basicAuthUsers = {};
basicAuthUsers[user] = password;

app.use('/admin/', basicAuth({
    users: basicAuthUsers,
    challenge: true
}));
app.use('/admin/', adminUIRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    if (err.name === 'JsonSchemaValidation') {
        err.status = 400;
        err.message = {
            receivedBody: req.body,
            validations: err.validations
        };
    } else if (err.name === 'ValidationError') {
        err.status = 400;
        err.message = {
            validations: err.errors,
            received: err.instance
        };
    } else if (err.name === 'WebserviceError') {
        err.status = 400;
    } else if (err.name === 'InvalidClientIdError') {
        err.status = 400;
    } else if (err.name === 'InvalidClientData') {
        err.status = 400;
    } else if (err.name === 'ClientError') {
        err.status = 400;
    } else if (err.name === 'ProductOffersError') {
        err.status = 400;
    } else if (err.name === 'UnknownInsuranceProposalError') {
        err.status = 400;
    }
    if (err.validations) {
        console.error(JSON.stringify(err, null, 2));
    } else {
        console.error(err);
    }
    res.status(err.status || 500).json({
        error: err.name,
        message: err.message
    });
});

function setUpAccessLogger() {
    const stage = process.env.NODE_ENV;
    const format = (stage === 'local' || stage === 'dockerlocal') ? winston.format.simple() : winston.format.json();
    return expressWinston.logger({
        transports: [
            new winston.transports.Console()
        ],
        format: winston.format.combine(
            winston.format.colorize(),
            format
        ),
        requestWhitelist: [...expressWinston.requestWhitelist, "body"],
        expressFormat: true,
        colorize: true,
    })
}

module.exports = app;
