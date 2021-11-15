const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagSchema = new Schema({
	tags: [{
		type: String,
		unique: true
	}]
});

const PostSchema = new Schema({
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	comments: [{
		type: Schema.Types.ObjectId,
		ref: "Comment"
	}],
	tags: [{
		type: String
	}],
	content: String,
	likesCount: Number,
	dislikesCount: Number,
}, { timestamps: true });

const Tag = mongoose.model("Tag", TagSchema)
const Post = mongoose.model("Post", PostSchema)

module.exports = {Post, Tag}