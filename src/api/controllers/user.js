const { User } = require('../../models/User')
const { asyncWrapper } = require('../middleware/asyncWrapper')

const modOptions = {new: true, runValidators: true}

const find = asyncWrapper(async (req, res) => {
	const { username } = req.params

	const user = await User.find({username}, 'username interests createdPosts ').exec();
	if (!user) { return res.status(500).json({ msg: `no user with username: ${username}`}) }
	res.status(200).json({
		user
	});
})

const update = asyncWrapper(async (req, res) => {
	const { username } = req.params

	const user = await User.findOneAndUpdate({username: username}, req.body, modOptions)
	if (!user) { return res.status(500).json({ msg: `no user with username: ${username}`}) }
	await user.save()

	res.status(200).json({
		user
	});
})

const remove = asyncWrapper(async (req, res) => {
	const { username } = req.params

	await User.findOneAndDelete({username: username})
	res.status(200).json({
		status: 'success'
	});
})

// const followToggle = asyncWrapper(async (req, res) => {
// 	const { username } = req.params
// 	const currUserId = req.user.id

// 	const user = await User.findOne({username: username})

// 	if (user.followers){

// 	}
// })

module.exports = { find, update, remove };