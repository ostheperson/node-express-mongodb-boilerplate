const {User, accountStatus} = require('../models/user.model');
const defaultAvatar = require('../config').defaultAvatar;
const {generateAuthToken} = require('../config/jwt');
const bcrypt = require('bcryptjs');
const { ApiError } = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../config/logger')

module.exports = {
    create: async (params) => {
        // the email and username must be unique
        let filter = {
                '$or' : [
                    {'username': params.username},
                    {'email': params.email }
                ]
            }

        let existingUser = await User.findOne(filter);
        if (existingUser) throw new ApiError(httpStatus.BAD_REQUEST, 'Email/Username already taken');
        
        const user = new User(params);

        user.avatar = defaultAvatar
        user.generateConfirmationCode();
        
        return await user.save();
    },

    update: async (query, params) => {
        const user = await User.findOneAndUpdate(query, params, {new: true});
        return user
    }, 

    get: async (query, select=[], populate='') => {
        const user = await User.findOne(query).select(select).populate(populate)
        if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        return user
    },

    getByUsername: async (username, populate='') => {
        let user = await User.findOne({username}).populate(populate)
        if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        return user
    },

    list: async () => {
        const users = await User.find();
        return users;
    },

    toggleBookmark: async ({_id}, productId) => {
        const user = await User.findOne({ _id}).select('bookmarks.products')
        if (user.bookmarks.products.includes(productId)) {
            user.bookmarks.products = user.bookmarks.products.filter(product => product != productId)
        } else {
            user.bookmarks.products.push(productId)
        }
        return await user.save()
    },

    toggleFollow: async (userId, username_to_follow) => {
        const user = await User.findOne({_id: userId}).select('username following followingCount')
        if (!user) throw new ApiError(httpStatus.BAD_REQUEST, `logged in user does not exist`)

        const user_to_follow = await User.findOne({username: username_to_follow}).select('followers')
        if (!user_to_follow) throw new ApiError(httpStatus.BAD_REQUEST, `user @${username_to_follow} does not exist`)

        if (user.following.includes(user_to_follow.id)){
            // unfollow
            user.following = user.following.filter((x) => x != user_to_follow.id)
            user_to_follow.followers = user_to_follow.followers.filter((x) => x != user.id)
        } else {
            // follow
            user.following.push(user_to_follow.id)
            user_to_follow.followers.push(user.id)
        }

        await user_to_follow.save()
        return await user.save()
    }
}