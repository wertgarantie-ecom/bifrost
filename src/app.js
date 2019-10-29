const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const resolvedPath = path.resolve(__dirname, '../config/' + process.env.ENVIRONMENT + '.env');
console.log(resolvedPath);
dotenv.config({path: resolvedPath});

const wertgarantieRoutes = require('./routes/wertgarantieRoutes');

const app = express();

const signSecret = process.env.COOKIE_SIGN_SECRET;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(signSecret));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.options('*', cors());
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
