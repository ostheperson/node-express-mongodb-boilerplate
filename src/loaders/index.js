
const dbLoader = require('./connectdb')
const expressLoader = require('./express')

module.exports = async (expressApp) => {
	await dbLoader();
	console.info('🗄  DB Connected...')

	await expressLoader(expressApp);
  	//console.info('✌️  Express loaded');
}