// const path = require('path');

// Set the NODE_ENV to 'development' if default NODE_ENV
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV !== 'production') {
    // const env = require("dotenv").config({ path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`)}); 
    const env = require("dotenv").config({ path: `.env.${process.env.NODE_ENV}`})
    if (env.error) {
        throw Error("⚠️  Couldn't find .env file  ⚠️");
    }
}

module.exports = {
    url: process.env.URL,
    /**
     * Your favorite port
     */
    port: parseInt(process.env.PORT, 10),

    NODE_ENV: process.env.NODE_ENV,
    /**
     * database
     */
    dbURL: process.env.MONGODB_URL,
    dbHost: process.env.HOST_DB,

    /**
     * Your secret stuff
     */
    jwtSecret: process.env.JWT_SECRET,
    jwtAlgorithm: process.env.JWT_ALGO,
    jwtLifetime: process.env.JWT_TOKEN_LIFETIME,

    /**
     * Used by winston logger
     */
    logs: {
        level: process.env.PINO_LOG_LEVEL || 'info',
    },

    smtpOptions: {
        service: "gmail", 
        // host: 'smtp.gmail.com',
        // port: 465,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        }
    },

    /**
     * API configs
     */
    api: {
        prefix: '/api',
    },

    userURL: process.env.USER_URL,
    defaultAvatar: process.env.DEFAULT_AVATAR,
    parent: process.env.PARENT,
};
