const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const sslRedirect = require('heroku-ssl-redirect');
const validate = require('express-jsonschema').validate;
const bodyParser = require('body-parser');
const requestWithSignedShoppingCartSchema = require('./schemas/signedShoppingCartSchema').requestWithSignedShoppingCartSchema;

const resolvedPath = path.resolve(__dirname, '../config/' + process.env.NODE_ENV + '.env');
dotenv.config({path: resolvedPath});

const wertgarantieRoutes = require('./routes/wertgarantieRoutes');
const validateShoppingCartRequest = require('./routes/shoppingCartRequestFilter').validateShoppingCart;
const signShoppingCart = require('./routes/shoppingCartResponseFilter').signShoppingCart;

const app = express();
const signSecret = process.env.SIGN_SECRET;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(signSecret));
app.use(express.static(path.join(__dirname, 'public')));

var corsOptions = {
    origin: true,
    credentials: true
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.options('*', cors(corsOptions));
app.use(sslRedirect(['prod', 'dev', 'staging']));

app.use('/healthcheck', require('express-healthcheck')());
app.use('/heroku', require('./controllers/herokuController'));
app.use('/wertgarantie/', validate({body: requestWithSignedShoppingCartSchema}), validateShoppingCartRequest);
app.use('/wertgarantie/', wertgarantieRoutes);
app.use('/wertgarantie/', signShoppingCart);

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
    } else if (err.name === 'HeimdallConnectionError') {
        err.status = 502;
    } else if (err.name === 'HeimdallClientError') {
        err.status = 400;
    } else if (err.name === 'InvalidClientIdError') {
        err.status = 400;
    } else if (err.name === 'InvalidClientData') {
        err.status = 400;
    }
    console.error(err);
    res.status(err.status || 500).json({
        error: err.name,
        message: err.message
    });
});

module.exports = app;
