const dotenv = require('dotenv')

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
	/**
	 * Your favorite port
	 */
	port: parseInt(process.env.PORT, 10),

	NODE_ENV: process.env.NODE_ENV,
	/**
	 * db stuff
	 */
	dbURL: process.env.MONGODB_URI,
	dbName: process.env.DB_NAME,

	/**
	 * Your secret stuff
	 */
	jwtSecret: process.env.JWT_SECRET,
	jwtAlgorithm: process.env.JWT_ALGO,

	/**
	 * Used by winston logger
	 */
	logs: {
		level: process.env.LOG_LEVEL || 'silly',
	},

	/**
	 * API configs
	 */
	api: {
		prefix: '/api',
	},
	/**
	 * Mailgun email credentials
	 */
	//   emails: {
	//     apiKey: process.env.MAILGUN_API_KEY,
	//     apiUsername: process.env.MAILGUN_USERNAME,
	//     domain: process.env.MAILGUN_DOMAIN
	//   }
};
