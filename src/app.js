const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const sslRedirect = require('heroku-ssl-redirect');

const resolvedPath = path.resolve(__dirname, '../config/' + process.env.NODE_ENV + '.env');
dotenv.config({path: resolvedPath});

const wertgarantieRoutes = require('./routes/wertgarantieRoutes');

const app = express();

const signSecret = process.env.COOKIE_SIGN_SECRET;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(signSecret));
app.use(express.static(path.join(__dirname, 'public')));

var corsOptions = {
    origin: true,
    credentials: true 
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(sslRedirect(['prod']));

app.use('/healthcheck', require('express-healthcheck')());

app.use('/wertgarantie/', wertgarantieRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    if (err.name === 'ValidationError') {
        err.status = 400;
    }
    console.error(err);
    res.status(err.status || 500).json({errors: err.details});
});

module.exports = app;
