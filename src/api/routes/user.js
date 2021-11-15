const express = require('express')
const userRoutes = express.Router()
const auth = require('../middleware/auth')
const userController = require('../controllers/user');

userRoutes.get('/:username', auth, userController.find);
userRoutes.patch('/:username', auth, userController.update);
userRoutes.delete('/:username', auth, userController.remove);

module.exports = userRoutes;