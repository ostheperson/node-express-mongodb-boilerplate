const express = require("express");
const cors = require("cors");

const config = require('../config');
const routes = require('../api/routes/routes');
const { notFound, errorHandler } = require('../errors');

module.exports = async (app) => {
	/**
	 * Health Check endpoints
	 */
	app.get('/status', (req, res) => {
		res.status(200).end();
	});
		app.head('/status', (req, res) => {
		res.status(200).end();
	});
	
	if (config.NODE_ENV === 'development') {
		const morgan = require('morgan');
		app.use(morgan('dev'));
	}
	
	app.use(cors());
	app.use(express.json({ extended: false }));
	app.use(express.urlencoded({extended: false}));
	
	// Load API routes
	app.use(config.api.prefix, routes);
	
	// 404
	app.use(notFound);
	
	// 500 - Any server error
	app.use(errorHandler);

	return app
}