const {userService,authService} = require('../services');
const { ApiError } = require('../utils/ApiError');
const httpStatus = require('http-status');
const { url, client_url } = require('../config')
const logger = require('../config/logger')
const jwt = require('../config/jwt')

module.exports = {
    register: async (req, res, next) => {
        try {
            const user = await user.create(req.body);
            const verificationSlug = await emailService.sendAccountVerificationEmail(user);

            res.status(httpStatus.CREATED).json({
                message:`An Email was sent to ${user.email} please verify via the link`,
                email: user.email,
                url: verificationSlug
            })
        } catch (error) {
            logger.error(error.message)
            next(error)
        }
    },

    login: async (req, res, next) => {
        try {
            const {user, token} = await authService.login(req.body);

            res.status(httpStatus.OK).json({
                message:`login successful`,
                data: user,
                token,
            })
        } catch (error) {
            logger.error(error.message)
            next(error)           
        }
    },
    
    /**
     * Logout
     * @returns {Promise}
     */
    logout: async (req, res, next) => {
        try {
            const authHeader = req.headers["authorization"];
            jwt.revokeToken(authHeader)
            res.status(httpStatus.OK).json({ message: 'Logout successful' })
        } catch (error) {
            logger.error(error.message)
            next(error)     
        }
    }

}