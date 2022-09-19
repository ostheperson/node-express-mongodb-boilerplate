const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config');
const httpStatus = require('http-status');
const { ApiError } = require('../utils/ApiError');

module.exports = (req, res, next) => {
	try {
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
        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).json({ msg: 'no bearer token provided' });
        }
		const decodedData = jwt.verify(token, jwtSecret);

		// todo check if the user account is active
		req.user = decodedData;
		next();

	} catch(err){
		return res.status(500).json({
			message: "error getting bearer token",
			error: err.message
		});
	}
}