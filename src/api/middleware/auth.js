const jwt = require('jsonwebtoken');
const  { JWT_SECRET  } =  process.env;

require('dotenv').config()

module.exports = (req, res, next) => {
	const getTokenFromHeader = (headers) => {
		if ((headers.authorization && headers.authorization.split(' ')[0] === 'Token') ||
			(headers.authorization && headers.authorization.split(' ')[0] === 'Bearer')
		) {
			return headers.authorization.split(' ')[1];
		} else {
			return headers.authorization;
		}
	};
	const token = getTokenFromHeader(req.headers)

	// Check if not token
	if (!token) {
		return res.status(401).json({ msg: 'No token, authorization denied' });
	}
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req["user"] = decoded.user;
		next();
	} catch (err) {
		res.status(401).json({ msg: err.message });
	}
};
