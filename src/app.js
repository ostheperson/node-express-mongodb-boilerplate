const express = require('express');
const config = require('./config');

async function startServer() {
	const app = express();

	const loader = await require('./loaders')
	loader(app);
	const server = app.listen(config.port, () => {
		console.info(`🛡️  Server listening on port: ${server.address().port}  🛡️`)
	}).on('error', err => {
		console.error(err.message);
		process.exit(1);
	});
}

startServer();