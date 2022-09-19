const {productService, userService} = require('../services')
const { ApiError } = require('../utils/ApiError');
const pick = require('../utils/pick');
const httpStatus = require('http-status');
const logger = require('../config/logger')

module.exports = {
    create: async (req, res, next) => {
        try {
            const product = await productService.create(req.body, req.user)
            await userService.update({ _id:req.user.id }, { $push: { products: product.id } })

            res.status(httpStatus.CREATED).json({
                message:`created`,
                data: product
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    },

    get: async (req, res, next) => {
        try {
            const product = await productService.get({ _id: req.params.productID })
            res.status(httpStatus.OK).json({
                message:`successful`,
                data: product
            })
        } catch (error) {
            logger.error(error.message)
            next(error)
        }
    },

    list: async (req, res, next) => {
        try {
            const product = await productService.list();
            res.status(httpStatus.OK).json({
                message:`successful`,
                ...product
            })
        } catch (error) {
            logger.error(error.message)
            next(error)
        }
    },

    update: async (req, res, next) => {
        try {
            product = await productService.update({ _id: req.params.productID }, params = req.body);
            res.status(httpStatus.OK).json({
                message: 'successful',
                data: product
            })
        } catch (error) {
            logger.error(error.message)
            next(error)
        }
    },

    delete: async (req, res, next) => {
        try {
            const product = productService.get({_id: req.params.productID, owner: req.user.id})
            if (!product) throw new ApiError(httpStatus.NOT_FOUND, "product not found");

            await productService.delete(req.params.productID);
            res.status(httpStatus.ACCEPTED).json({message: 'successfully removed product'})
        } catch (error) {
            logger.error(error.message)
            next(error)
        }
    }
}