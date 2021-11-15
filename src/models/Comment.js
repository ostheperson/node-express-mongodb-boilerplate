const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	content: String,
	postId: {
		type: Schema.Types.ObjectId,
		ref: "Post",
		required: true,
	},
}, { timestamps: true });

const Comment = mongoose.model("Comment", CommentSchema)

module.exports = {Comment}