const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const sslRedirect = require('heroku-ssl-redirect');
const bodyParser = require('body-parser');
const localeRequestFilter = require('./routes/localeRequestFilter');

const resolvedPath = path.resolve(__dirname, '../config/' + process.env.NODE_ENV + '.env');
dotenv.config({path: resolvedPath});

const wertgarantieRoutes = require('./routes/wertgarantieRoutes');
const detectBase64EncodedRequestBody = require('./shoppingcart/shoppingCartRequestFilter').detectBase64EncodedRequestBody;
const checkSessionIdCheckout = require('./shoppingcart/shoppingCartRequestFilter').checkSessionIdCheckout;
const validateShoppingCartRequest = require('./shoppingcart/shoppingCartRequestFilter').validateShoppingCart;

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

var corsOptions = {
    origin: true,
    credentials: true,
    exposedHeaders: [
        'X-wertgarantie-shopping-cart-delete'
    ]
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.options('*', cors(corsOptions));
app.use(sslRedirect(['prod', 'dev', 'staging']));

app.use(require('./shoppingcart/shoppingCartResponseFilter'));
app.use('/healthcheck', require('express-healthcheck')());
app.use('/heroku', require('./heroku/herokuController'));
app.use('/wertgarantie/', localeRequestFilter.getBrowserLocale);
app.use('/wertgarantie/', detectBase64EncodedRequestBody);
app.use('/wertgarantie/', checkSessionIdCheckout);
app.use('/wertgarantie/', validateShoppingCartRequest);
app.use('/wertgarantie/', wertgarantieRoutes);

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
    } else if (err.name === 'HeimdallConnectionError') {
        err.status = 502;
    } else if (err.name === 'HeimdallClientError') {
        err.status = 400;
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

module.exports = app;
