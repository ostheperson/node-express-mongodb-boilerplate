const jwt = require('jsonwebtoken');
const {jwtSecret, jwtLifetime } = require('./index');

module.exports = {
    /**
     * * generates jwt token
     * @param {object} user 
     * @returns
     */
    generateAuthToken: (payload) => {
        return jwt.sign(payload, jwtSecret, { expiresIn: '2d' });
    }
}