const { createCustomError } = require('../errors/custom-error')
const {User} = require('../models/User');
const config = require('../config')

const signInUser = async (newUser, next) => {
	if (!newUser) { throw { message: 'Authentication failed', error: 'no user found' } }
	const { email, password } = newUser;

	try {
		let user = await User.findOne({ email: email });
		if (!user) { throw { message: 'Authentication failed' } }
		const isMatch = await user.comparePassword(password)
		if (!isMatch) { throw { message: 'Authentication failed' } }
		const token = await generateToken(user)

		return token
	} catch (err) {
		next(createCustomError(err.message, 500))
	}
}

const registerUser = async (newUser) => {
	try {
		let data = new User(newUser);
		await data.save()
		const { username, _id, email } = data
		return { username, _id, email }
	} catch (err) {
		console.log(err)
		return createCustomError(err.message, 500)
	}
}

function generateToken (user) {
	return jwt.sign({
		user: {
			id: user._id,
			username: user.username
		}
	}, 
	config.JWT_SECRET, 
	{ expiresIn: config.JWT_TOKEN_LIFETIME });
}

module.exports = { signInUser, registerUser};