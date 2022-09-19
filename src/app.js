const express = require('express');
const path = require('path')
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./routes');
const httpStatus = require('http-status');
const { errorConverter, errorHandler } = require('./middleware/error');
const {ApiError} = require('./utils/ApiError');
const logger = require('./config/logger');
const {api} = require('./config');
const app = express();

app.use(morgan('dev'))

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.set('view engine', 'ejs');

// health endpoints
app.get('/status', (req, res) => {
    res.status(200).end();
});
app.head('/status', (req, res) => {
    res.status(200).end();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(path.resolve(__dirname, '..'), 'public', 'index.html'));
});

// api routes
app.use(api.prefix, routes)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

app.use(errorHandler);

module.exports = server;
