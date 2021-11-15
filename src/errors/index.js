const notFound = (req, res) => res.status(404).json({msg: 'Route '+req.url+' Not found.'})

const errorHandler = (err, req, res, next) => {
	console.error(`🔥 ${err.message}`)
	if (err instanceof CustomAPIError) { return res.status(err.statusCode).json({ msg: err.message }) }
	res.status(500).json({ msg: err.message });
}

module.exports = { notFound, errorHandler }