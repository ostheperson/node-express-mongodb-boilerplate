const { signInUser, registerUser } = require('../../services/auth')
const { validationResult } = require('express-validator');
//const { generateToken } = require('../../services/auth');
const {User} = require('../../models/User');
const { asyncWrapper } = require('../middleware/asyncWrapper')

const { CustomAPIError } = require('../../errors/custom-error')

const login = asyncWrapper(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(400).json({ message: errors.array() });
	}
	
	const token = await signInUser(req.body, next)
	
	res.status(200).json({
		message: 'Authentication successful',
		token
	})
	
})

const register = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(400).json({ message: errors.array() });
	}
	const newUser = req.body

	const isMatchPassword = newUser.confirmPassword !== newUser.password
	if (isMatchPassword) { res.status(400).json({ message: "passwords don't match"}) }

	const isEmailExist = await User.find({email: req.body.email});
	if (isEmailExist.length >= 1) { res.status(409).json({ message: "Email exists" }) }

	const isUsernameExist = await User.find({username: req.body.username});
	if (isUsernameExist.length >= 1) { res.status(409).json({ message: "Username exists" }) }

	const result = await registerUser(req.body)
	if (result instanceof CustomAPIError) {
		return next(result)
	} else {
		res.status(200).json({ 
			message: 'Successfully registered a new user',
			result
		})
	}
}

const logout = async (req, res, next) => {
	try {
		return res.status(200).end();
	} catch (e) {
		logger.error('🔥 error %o', e);
		return next(e);
	}
}

module.exports = { login, register, logout }