const {Token} = require('../models/token.model');
const { ApiError } = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../config/logger')

const select_options = ['']
// done
module.exports = {
    getUserToken: async (query, select=[]) => {
        const token = await Token.findOne(query).select(...select)
        return token
    }
}