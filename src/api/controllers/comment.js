const { Post } = require('../../models/Post')
const { Comment } = require('../../models/Comment')

//const { asyncWrapper } = require('../middleware/asyncWrapper')

const find = async(req, res, next) => {
	const commentId = req.params.commentId
	try {
		const comment = await Comment.findById({ _id: commentId })
		res.status(200).json({
			
			comment
		})
	} catch (err) {
		console.log('Something went wrong while finding comment.'); 
		next(err) 
	}
}

const create = async (req, res, next) => {
	const postId = req.params.postId
	let post = {}

	try {
		post = await Post.findById({ _id: postId })
	} catch (err) {
		console.log('Something went wrong while finding comment post.'); 
		next(err) 
	}
	
	let newComment = new Comment(req.body)
	newComment.createdBy = req.user.id
	newComment.postId = postId

	try {
		const comment = await newComment.save()
		await post.comments.push(comment._id)
		await post.save()
		res.status(200).json({
			comment
		});
	} catch (err) {
		console.log('Something went wrong while saving comment.');
		next(err)
	}
};

const remove = async (req, res, next) => {
	const postId = req.params.postId
	const commentId = req.params.commentId

	try {
		await Comment.deleteOne({_id:commentId})
	} catch (err) {
		console.log("🔥 Something went wrong while deleting comment 🔥")
		next(err)
	}

	try {
		const result = await Post.findByIdAndUpdate(postId, { $pull: { 'comments': commentId } })
		res.status(200).json({
			status: 'success'
		});
	} catch (err) {
		console.log('Something went wrong while deleting comment.');
		next(err)
	}
};

module.exports = { find, create, remove };