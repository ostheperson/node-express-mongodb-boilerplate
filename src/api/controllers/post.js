const { Tag, Post } = require('../../models/Post')
const { Comment } = require('../../models/Comment')
const { asyncWrapper } = require('../middleware/asyncWrapper')
const { createCustomError } = require('../../errors/custom-error')
const { User } = require('../../models/User')

/**
 * 
 * @param {*} req
 * @param {*} res 
 * @param {*} next 
 */

/*
list
{ data: { tags: [] }  }
*/
const registerTags = (tags) => {
	tags.forEach(tag => {
		Tag.findOneAndUpdate(
			{ tags: tag },
			{ "$push": tag },
			{ "upsert": true },
			(err, doc) => {
				if (err) {
					return next(createCustomError("Something wrong when creating tags!", 500))
				}
			}
		)	
	})
}

const list = asyncWrapper(async (req, res) => {
	const query = req.body.query
	const results = await Post.find(query)
	res.status(200).json({
		posts: [...results],
		nbHits: posts.length
	})
})

const find = asyncWrapper(async (req, res) => {
	const queryObject = {}
	const { content, tags, sort, createdBy, fields } = req.query
	let { limit, page } = req.query
	
	if (content) {
		queryObject.content = { $regex:content, $options: 'i' }
	}

	if (tags) {
		if (tags.length > 0) {
			queryObject.tags = { $in: [ tags ] }
			//posts = await Post.find({ tags: { $in: [ ...tags ] } } );
		}
	}

	if (createdBy) {
		const aUser = await User.find({usercontent:createdBy}, '_id').exec()
		queryObject.createdBy = aUser
	}

	let result = Post.find(queryObject)

	if (sort) { 
		const sortList = sort.split(',').join(' ')
		result = result.sort(sortList) 
	} else {
		result = result.sort('updatedAt')
	}

	if (fields) {
		const fieldList = fields.split(',').join(' ')
		result = result.select(fieldList) 
	}

	page = Number(page) || 1;
	limit = Number(limit) || 10;
	let skip = (page - 1) * limit

	result = result.skip(skip).limit(limit)

	const posts = await result
	res.status(200).json({
		nbHits: posts.length,
		posts: [...posts]
	});
})

/*
create { 
data: { 
	post: {
		tags: [],
		description: String
	},
} }
*/
const create = asyncWrapper(async (req, res) => {
	const { tags } = req.body.post
	if (tags) {
		registerTags(tags)
	}

	const post = new Post(req.body.post)
	post.createdBy = req.user.id

	const result = await post.save()
	res.status(200).json({
		post: result
	});
})
/*
update
{ 	data: { 
		tags: [],
		content: String
	}  
}
*/
const update = asyncWrapper(async (req, res) => {
	const { newPost } = req.body
	const { postId } = req.params

	if (post.tags) {
		registerTags(post.tags)
	}
	
	const post = await Post.findOne({_id: postId})
	post.tags = newPost.tags
	post.content = newPost.content
	post = await post.save()
	res.status(400).json({
		post
	});
})

const details = asyncWrapper(async (req, res) => {
	const { postId } = req.params
	const post = await Post.findOne({_id: postId}).exec()
	if (!post) { next(createCustomError({ msg: `no post with id: ${postId}`}, 500)) }

	res.status(200).json({
		post 
	});
})

const remove = asyncWrapper(async (req, res) => {
	//const { posts } = req.body
	await Post.deleteOne({_id: id})
	await Comment.deleteMany({postId: id})
	await Answer.deleteMany({postId: id})
	
	res.status(200).json({
		status: 'success'
	})
})

module.exports = { find, list, create, details, remove, update };