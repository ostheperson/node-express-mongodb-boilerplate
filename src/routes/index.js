const express = require('express');
const app = express.Router();

app.use('/account', require('./api/auth')); //auth
app.use('/users', require('./api/users')); //users
app.use('/products', require('./api/products')); //products

module.exports = app;