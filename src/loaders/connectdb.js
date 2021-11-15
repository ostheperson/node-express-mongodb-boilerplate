const mongoose = require("mongoose");

const config = require('../config')

let uri = ""

if (config.NODE_ENV === 'development') {
	// const uri = config.dbURL
	// const dbname = config.dbName
	// var url = uri+dbname
	uri = config.dbURL + config.dbName
}
else {
	uri = config.dbURL
}

module.exports = async () => {
	const connection = await mongoose.connect(uri, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	});
	return connection.connection.db
};

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));