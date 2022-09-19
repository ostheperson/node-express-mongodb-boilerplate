const {User, accountStatus} = require('../models/user.model');
const {generateAuthToken} = require('../config/jwt');
const { emailService } = require('./email.service');
const { ApiError } = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../config/logger')

module.exports = {
    /**
     * @param {object} body 
     * @returns 
     */
    login: async ({email, username, password}) => {
        let filter = {
                '$or' : [
                    {'username': username},
                    {'email': email }
                ]
            }
        const user = await User.findOne(filter)
        if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'user does not exist');
        if (!await user.comparePassword(password)) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Credentials');

        // if(user.status !== accountStatus.ACTIVE ) throw new ApiError(httpStatus.BAD_REQUEST, "cannot authenticate");
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
        }

        const token = generateAuthToken(payload);
        user.last_login_time = Date.now()
        await user.save()

        return {user, token}
    },
    
    verifyConfirmationCode: async ({ token }) => {
        const user = await User.findOne({confirmation_code: token});

        if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'Confirmation token not found');

        user.verified = Date.now();
        user.confirmationCode = "";
        await user.save();
    },

    changePassword: async ({password, token}) => {
        const user = await User.findOne({confirmation_code: token});

        if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'Confirmation token not found');

        user.password = password;
        user.confirmation_code = ""
        return await user.save();
    },

}