const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const sslRedirect = require('heroku-ssl-redirect');
var bodyParser = require('body-parser');

const resolvedPath = path.resolve(__dirname, '../config/' + process.env.NODE_ENV + '.env');
dotenv.config({path: resolvedPath});

const wertgarantieRoutes = require('./routes/wertgarantieRoutes');
const validateSessionId = require('./routes/sessionIdValidator').validateSessionId;

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

app.use('/wertgarantie/', validateSessionId);
app.use('/wertgarantie/', wertgarantieRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    if (err.name === 'JsonSchemaValidation') {
        err.status(400);
        err.details = {
            receivedBody: req.body,
            validations: err.validations
        };
    } else if (err.name === 'ValidationError') {
        err.status = 400;
    } else if (err.name === 'HeimdallConnectionError') {
        err.status = 502;
        err.details = err.message;
    } else if (err.name === 'HeimdallClientError') {
        err.status = 400;
        err.details = err.message;
    }
    console.error(err);
    res.status(err.status || 500).json({errors: err.details});
});

module.exports = app;
