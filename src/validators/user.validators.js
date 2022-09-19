const Joi = require('joi')
const { password } = require('./custom.validators');


const list = {
	query: Joi.object().keys({
		name: Joi.string(),
		role: Joi.string(),
		sortBy: Joi.string(),
		limit: Joi.number().integer(),
		page: Joi.number().integer(),
	}),
};

const getByUsername = {
	params: Joi.object().keys({
		username: Joi.string().max(15),
	}),
};

const update = {
	params: Joi.object().keys({
		username: Joi.string().max(15),
	}),
	body: Joi.object()
		.keys({
			password: Joi.string().custom(password),
			name: Joi.string(),
			display_name: Joi.string(),
			country: Joi.string(),
			dob: Joi.date(),
			avatar: Joi.string()
		}).min(1),
};

const deleteUser = {
	params: Joi.object().keys({
		username: Joi.string(),
	}),
};

module.exports = {
	list,
	getByUsername,
	update,
	delete,
};