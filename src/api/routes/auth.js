const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/auth');
const auth = require('../middleware/auth')

const router = express.Router();

// @route     POST api/auth
// @desc      Auth user & get token
// @access    Public

router.post('/signin', [
	check('email', 'Please include a valid email').isEmail(),
	check('password', 'Password is required').exists(),
], authController.login);

router.post('/signup', [
	check('email', 'Please include a valid email').isEmail(),
	check('password', 'Password is required').exists(),
], authController.register);

router.post('/signout', auth, authController.logout);

module.exports = router;
