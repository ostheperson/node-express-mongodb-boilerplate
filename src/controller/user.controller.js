const { userService } = require('../services');
const { ApiError } = require('../utils/ApiError');
const pick = require('../utils/pick');
const httpStatus = require('http-status');
const logger = require('../config/logger')

module.exports = {
    list: async (req, res, next) => {
        try {
            const result = await userService.list();

            res.status(httpStatus.OK).json({
                message:`successful`,
                ...result
            })
        } catch (error) {
            logger.error(error.message)
            next(error)
        }
    },

    getByUsername: async (req, res, next) => {
        try {
            const username = req.params.username
            const user = await userService.getByUsername(username, 'events products')
 
            res.status(httpStatus.OK).json({
                message:`successful`,
                data: user
            })
        } catch (error) {
            logger.error(error.message)
            next(error)
        }
    },

    update: async (req, res, next) => {
        try {
            const params = req.body
            const user = await userService.update({ _id:req.user.id}, params)
            
            res.status(httpStatus.OK).json({
                message:`successful`,
                data: user
            })
        } catch (error) {
            logger.error(error.message)
            next(error)
        }
    },

    toggleFollow: async(req, res, next) => {
        try {
            const username_to_follow = req.params.username
            const {id, username} = req.user
            if (username_to_follow == username) throw new ApiError(httpStatus.BAD_REQUEST, 'user cannot follow themselves')
            const user = await userService.toggleFollow(id, username_to_follow)
            res.status(httpStatus.OK).json({
                message:`successful`,
                data: user
            })
        } catch (err) {
            logger.error(err.message)
            next(err)
        }
    },

    toggleBookmark: async(req, res, next) => {
        try {
            const {product} = req.query
            const {bookmarks} = await userService.toggleBookmark({ _id:req.user.id}, product)

            res.status(httpStatus.OK).json({
                message:`successful`,
                products: bookmarks.products
            })
        } catch (error) { 
            logger.error(error.message)
            next(error)
        }
    },
    
    create: async (req, res, next) => {
        try {
            res.status(httpStatus.OK).json({
                message:`use route instead for user login`,
                url: '/api/account/register'
            })
        } catch (error) {
            logger.error(error.message)
            next(error)
        }
    },

	delete: async (req, res, next) => {
		try {
			await userService.deleteUser(req.body);
			res.status(httpStatus.CREATED).json({message: 'successfully removed user'})
		} catch (error) {
            logger.error(error.message)
			next(error)
		}
	}
}