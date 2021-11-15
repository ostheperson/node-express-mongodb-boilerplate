const express = require('express');
const app = express.Router();


app.use('/auth', require('./auth'))
app.use('/post', require('./post'))
app.use('/comment', require('./comment'))
app.use('/user', require('./user'))

module.exports = app;